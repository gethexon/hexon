# HNotification

## 基础

<HNotification type="fixed" :z-index="9999"></HNotification>
<HButton @click="info">info</HButton>
<HButton @click="success" type="success">success</HButton>
<HButton @click="warning" type="warning">warning</HButton>
<HButton @click="error" type="error">error</HButton>&nbsp

## 可点击

<HButton @click="click">click</HButton>

## 控制

<HButton @click="close" >close</HButton>

## 永久

<HButton @click="permanent">permanent</HButton>

## 不同位置

<HButton @click="tl">左上</HButton>
<HButton @click="t">上</HButton>
<HButton @click="tr">右上</HButton>
<HButton @click="bl">左下</HButton>
<HButton @click="b">下</HButton>
<HButton @click="br">右下</HButton>

<script setup>
import { computed } from 'vue'
import HButton from '~/components/HButton.vue'
import HNotification from '~/components/HNotification/HNotification.vue'
import { useNotification } from "~/lib/notification"
const notification = useNotification()
const info = () => {  
  notification.notify({title:'test title', desc: new Date().toString()})
}
const success = () => {
  notification.notify({title:'test title', desc: new Date().toString(), type: "success"})
}
const warning = () => {
  notification.notify({title:'test title', desc: new Date().toString(), type: "warning"})
}
const error = () => {
  notification.notify({title:'test title', desc: new Date().toString(), type: "error"})
}
const click = () => {  
  notification.notify({title:'clickable', onClick: () => {
    notification.notify({title:'click has been clicked', type: "success"})
  }})
}
const close = () => {
  notification.closeAll()
}
const display = computed(() => notification.notificationList.value.map(item => item.id))
const permanent = ()=>{
  notification.notify({title:'permanent', permanent: true})
}
const tl = () => {
  notification.setPosition('top-left')
  notification.notify({title:'top-left'})
}
const t = () => {
  notification.setPosition('top')
  notification.notify({title:'top'})
}
const tr = () => {
  notification.setPosition('top-right')
  notification.notify({title:'top-right'})
}
const bl = () => {
  notification.setPosition('bottom-left')
  notification.notify({title:'bottom-left'})
}
const b = () => {
  notification.setPosition('bottom')
  notification.notify({title:'bottom'})
}
const br = () => {
  notification.setPosition('bottom-right')
  notification.notify({title:'bottom-right'})
}
</script>
