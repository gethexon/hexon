# HLoginForm

## 基础

<div style="background-color:var(--color-background-base3);padding:20px;display:inline-block">
<HLoginForm name="HLoginForm" @on-submit="onSignin"></HLoginForm>
</div>

<script setup>
import HLoginForm from '../src/components/HLoginForm.vue'
const onSignin = (payload)=> {
  console.log(payload);
}
</script>
