<script setup>
const route = useRoute();
const { data: trainer, refresh } = await useFetch(
    () => `/api/trainer/${route.params.trainer_name}`,
    {
        default: () => [],
    },
);
console.log("🚀 ~ file: index.vue:6 ~ route.params.trainer_name:", route.params.trainer_name)
console.log("ここ１")
console.log(trainer.name)

</script>


<template>
    <div>
        <h1>トレーナーの情報</h1>
        <div class="trainer-info">
            <img src="/avatar2.png" />
            <p>{{ trainer.name }}</p>
        </div>
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