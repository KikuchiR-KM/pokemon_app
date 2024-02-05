<script setup>
const router = useRouter();
// const config = useRuntimeConfig();
const trainerName = ref("")
const cleanedTrainerName = computed(()=>trimAvoidCharacters(trainerName.value));
const valid = computed(() => cleanedTrainerName.value.length > 0);
const { dialog, onOpen, onClose } = useDialog();

const onSubmit = async() => {
  // 名前を決定した後の処理
  const response = await $fetch("/api/trainer",{
    // baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: cleanedTrainerName.value,
    }),
  }).catch((e) => e);
  if(response instanceof Error) return;
  router.push(`/trainer/${cleanedTrainerName.value}`);
};

</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>きみのなまえをおしえてくれ！</p>


    <form @submit.prevent>
      <div class="item">
        <label for="name">なまえ</label>
        <input
          id="trainerName"
          v-model="trainerName"
          @keydown.enter="valid && onOpen(true)"
          >
      </div>
      <GamifyButton type="button" :disabled="!valid" @click="onOpen(true)">けってい</GamifyButton>
    </form>


      <GamifyDialog
        v-if="dialog"
        id="confirm-dialog"
        title = "さいしゅうかくにん"
        :description="`きみのなまえは、${cleanedTrainerName}であっているか？`"
        @close="onClose"
      >
        <GamifyList :border="false" direction="horizon">
          <GamifyItem>
            <GamifyButton @click="onSubmit">はい</GamifyButton>
          </GamifyItem>
          <GamifyItem>
            <GamifyButton @click="onClose">いいえ</GamifyButton>
          </GamifyItem>
        </GamifyList>

      </GamifyDialog>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
