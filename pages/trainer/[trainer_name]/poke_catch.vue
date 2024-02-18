<script setup>
const route = useRoute();
const router = useRouter();

const BASE_URL = "https://pokeapi.co/api/v2/";

// pageを区切るならpage,limitの値を動的に変化させればよい
const page = 0;
const limit = 1302;
const pokemonData = ref([]);
const pokemonJapaneseNames = ref([]);

const {
    dialog:catchDialog,
    onOpen:onOpenCatch,
    onClose: onCloseCatch
 } = await useDialog();

const getPokemonJapaneseName = async (englishName) => {
    try {
        const response = await fetch(`${BASE_URL}pokemon-species/${englishName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error("ポケモンの情報を取得できませんでした。");
        }
        const data = await response.json();
        const nameInfo = data.names.find(name => name.language.name === 'ja-Hrkt');
        return nameInfo ? nameInfo.name : "日本語名が見つかりません。";
    } catch (error) {
        console.error("エラー:", error.message);
        return "ポケモンの情報を取得できませんでした。";
    }
};

onMounted(async () => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            pokemonData.value = data.results;

            // 各ポケモンに対して非同期で日本語名を取得
            const promises = pokemonData.value.map(pokemon => getPokemonJapaneseName(pokemon.name));
            pokemonJapaneseNames.value = await Promise.all(promises);
        } else {
            throw new Error("ポケモンの情報を取得できませんでした。");
        }
    } catch (error) {
        console.error("エラー:", error.message);
    }
});

const onCatch = async (pokemon) => {
    console.log("🚀 ~ file: poke_catch.vue:53 ~ onCatch ~ pokemon:", pokemon)
    const response = await $fetch(`/api/trainer/${route.params.trainer_name}/pokemon`, {
    method: "POST",
    body: {
        name: pokemon.name,
    },
    }).catch((e) => e);
    if (response instanceof Error) return;
    router.push(`/trainer/${route.params.trainer_name}`);
};

</script>

<template>
    <div>
        <h1>どのポケモンとなかよくなる？</h1>

        <GamifyList>
            <GamifyItem v-for="(pokemon, index) in pokemonData" :key="pokemon.url">
                <p class="pokemon-name">{{ pokemonJapaneseNames[index] }}</p>
                <GamifyButton type="Button" @click="onOpenCatch([pokemon, index+1])">コンタクトする</GamifyButton>
            </GamifyItem>
        </GamifyList>

        <GamifyDialog
            v-if="catchDialog"
            id="confirm-catch"
            title="かくにん"
            :description = "`${ pokemonJapaneseNames[catchDialog[1]-1] }でいい？`"
            @close="onCloseCatch">
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onCatch(catchDialog[0])">はい</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onCloseCatch">いいえ</GamifyButton>
                </GamifyItem>
            </GamifyList>
        </GamifyDialog>
    </div>
</template>
