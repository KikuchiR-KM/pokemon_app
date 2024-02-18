import { Router } from "express";
import { findTrainer, findTrainers, upsertTrainer, deleteTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World 2024");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // [x]TODO: 期待するレスポンスボディに変更する
    const trainerName = trainers.map(({Key}) => Key.replace(/\.json$/,""))
    res.send(trainerName);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {

  try {
    // [x]TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    if (!("name" in req.body) || req.body.name.length <=0){
      return res.sendStatus(400);
    }
    // [x] TODO:すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const trainers = await findTrainers();
    const requestedTrainersKey = `${req.body.name}.json`;
    const trainerAlreadyExists = trainers.some(({Key}) => Key === requestedTrainersKey);
    if(trainerAlreadyExists){
      return res.sendStatus(409);
    }
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// [x] TODO: トレーナーを取得する API エンドポイントの実装
router.get("/trainer/:trainerName", async (req, res, next) => {
  console.log("トレーナーの取得")
  try{
    const {trainerName} = req.params;
    const trainer = await findTrainer(trainerName);
    res.send(trainer);
  }catch(err){
    next(err);
  }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // [ ] TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
//[x] TODO: トレーナーを削除する API エンドポイントの実装
router.delete("/trainer/:trainerName", async(req, res, next) => {
  try{
    const { trainerName } = req.params;
    const result = await deleteTrainer(trainerName)
    res.status(result["$metadata"].httpStatusCode).send(result);
  }catch(err){
    next(err)
  }
});

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  console.log("post pokemon")
  try {
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName)
    const lastPokemonId = trainer.pokemons.length > 0
      ? trainer.pokemons[trainer.pokemons.length - 1].id
      : 0;
    const newPokemonId = lastPokemonId + 1;
    console.log("🚀 ~ file: router.js:92 ~ router.post ~ newPokemonId:", newPokemonId)
    console.log("🚀 ~ file: router.js:99 ~ router.post ~ req.body.name:", req.body.name)

    // [x] TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    if (!("name" in req.body) || req.body.name.length <=0){
      return res.sendStatus(400);
    }
    console.log("ここ")
    const pokemon = await findPokemon(req.body.name);
    console.log("🚀 ~ file: router.js:99 ~ router.post ~ pokemon:", pokemon)
    // [x] TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    const {
      name,
      order,
      sprites:{front_default},
    } = pokemon;

    trainer.pokemons.push({
      id:newPokemonId,
      name,
      order,
      sprites:{front_default},
    });

    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
// [ ] TODO: ポケモンを削除する API エンドポイントの実装


export default router;
