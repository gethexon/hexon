<script setup lang="ts">
import HChangePasswordForm from "@/forms/HChangePasswordForm.vue"
import { useAccount } from "~/lib/account"
import { IChangePasswordFormPayload } from "~/components/forms/interface"
import { useNotification } from "~/lib/notification"
const account = useAccount()
const notification = useNotification()
const onChangePassword = (payload: IChangePasswordFormPayload) => {
  account
    .changeInfo(payload.oldPassword, { password: payload.newPassword })
    .then(
      () => {
        notification.notify({ type: "success", title: "密码修改成功" })
      },
      (err) => {
        notification.notify({
          title: "密码修改失败",
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
      }
    )
}
</script>
<template>
  <HChangePasswordForm class="w-72" @change-password="onChangePassword" />
</template>
