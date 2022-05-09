<script setup lang="ts">
import { Ref, ref } from "vue"
import DemoPad from "@/DemoPad.vue"
import HChangePasswordForm from "../HChangePasswordForm.vue"
import { IChangePasswordFormPayload } from "../interface"
const res: Ref<any> = ref()
const onChange = (payload: IChangePasswordFormPayload) => {
  res.value = payload
}
</script>
<template>
  <DemoPad>
    <HChangePasswordForm @change-password="onChange" />
    <div>
      {{ res }}
    </div>
  </DemoPad>
</template>
