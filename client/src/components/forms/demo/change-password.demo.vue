<script setup lang="ts">
import { Ref, ref } from "vue"
import HChangePasswordForm from "../HChangePasswordForm.vue"
import { IChangePasswordFormPayload } from "../interface"
const res: Ref<any> = ref()
const onChange = (payload: IChangePasswordFormPayload) => {
  res.value = payload
}
</script>
<template>
  <HChangePasswordForm @change-password="onChange" />
  <div>
    {{ res }}
  </div>
</template>
