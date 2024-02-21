<script setup>

const route = useRoute();
const router = useRouter();

const{
    dialog:deleteDialog,
    onOpen:onOpenDel,
    onClose:onCloseDel
} = useDialog();

const{
    dialog:byeDialog,
    onOpen:onOpenBye,
    onClose:onCloseBye
} = useDialog();

const { data: trainer, refresh } = await useFetch(
    () => `/api/trainer/${route.params.trainer_name}`,
    {
        default: () => [],
    },
);

const eraseTrainer = async () => {
    const response = await $fetch(`/api/trainer/${route.params.trainer_name}`, {
        method:"DELETE",
    }).catch((e) => e);
    if(response instanceof Error) return;
    router.push("/")
};

const byePokemon = async (pokemonId) =>{
    const response = await $fetch(
        `/api/trainer/${route.params.trainer_name}/pokemon/${pokemonId}`,
        {
            method: "DELETE"
        }
    ).catch((e) => e);
    if(response instanceof Error) return;
    await refresh();
    onCloseBye();
};

</script>


<template>
    <div>
        <header>
            <NuxtLink to="/">ホーム</NuxtLink>
            <span class="link-gap"></span>
            <NuxtLink to="/trainer">トレーナーの一覧</NuxtLink>
        </header>
        <h1>トレーナーの情報</h1>
        <div class="trainer-info">
            <img src="/avatar2.png" />
            <p>{{ trainer.name }}</p>
        </div>
        <GamifyButton type="button" @click="onOpenDel(true)">トレーナ情報の削除</GamifyButton>
        
        <h2>なかよしのポケモン</h2>
        <CatchButton :to = "`/trainer/${route.params.trainer_name}/poke_catch`">ポケモン捕縛</CatchButton>
        <!-- [x] TODO: 捕まえたポケモンを表示する -->
        <GamifyList>
            <GamifyItem v-for="pokemon in trainer.pokemons" :key="trainer.id">
                <img :src="pokemon.sprites.front_default" />
                <p class="pokemon-name">{{ pokemon.jp_name }}</p>
                <GamifyButton type="button" @click="onOpenBye(pokemon)">バイバイ🖐️</GamifyButton>
            </GamifyItem>
        </GamifyList>
        
        
        <!-- トレーナー削除の確認ダイアログ -->
        <GamifyDialog 
            v-if="deleteDialog"
            id="del-confirm-dialog"
            title="さいしゅうかくにん"
            :description="`${trainer.name}のじょうほうは、もとにもどせないけどいいか？`"
            @close="onCloseDel"
        >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="eraseTrainer">はい</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onCloseDel">いいえ</GamifyButton>
                </GamifyItem>
            </GamifyList>
        </GamifyDialog>

        <!-- ポケモン削除のダイアログ -->
        <GamifyDialog 
            v-if="byeDialog"
            id="bye-confirm-dialog"
            title="お別れのかくにん"
            :description="`${byeDialog.jp_name}とかんぜんにおわかれする？`"
            @close="onCloseDel"
        >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="byePokemon(byeDialog.id)">はい</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onCloseBye">いいえ</GamifyButton>
                </GamifyItem>
            </GamifyList>
        </GamifyDialog>

    </div>
</template>

<style scoped>
.trainer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.trainer-info > img {
    width:80px;
    height:80px;
}

.link-gap {
    margin-right: 20px;
}
</style>