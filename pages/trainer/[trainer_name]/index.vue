<script setup>
// import { Router } from 'express';

const route = useRoute();
const router = useRouter();

const{
    dialog:deleteDialog,
    onOpen:onOpenDel,
    onClose:onCloseDel
} = useDialog();



const { data: trainer, refresh } = await useFetch(
    () => `/api/trainer/${route.params.trainer_name}`,
    {
        default: () => [],
    },
);
console.log("🚀 ~ file: index.vue:6 ~ route.params.trainer_name:", route.params.trainer_name)
console.log(trainer.name)

const eraseTrainer = async () => {
    const response = await $fetch(`/api/trainer/${route.params.trainer_name}`, {
        method:"DELETE",
    }).catch((e) => e);
    console.log("if***************")
    if(response instanceof Error) return;
    console.log("router.push("/")")
    router.push("/")
};

</script>


<template>
    <div>
        <h1>トレーナーの情報</h1>
        <div class="trainer-info">
            <img src="/avatar2.png" />
            <p>{{ trainer.name }}</p>
        </div>
        <GamifyButton type="button" @click="onOpenDel(true)">トレーナ情報の削除</GamifyButton>
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
</style>