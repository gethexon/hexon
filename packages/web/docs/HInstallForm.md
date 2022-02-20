# HInstallForm

## 基础

<div style="background-color:var(--color-primary-n);padding:20px;display:inline-block">
<HInstallForm name="HInstallForm" @on-submit="onInstall"></HInstallForm>
</div>

<script setup>
import HInstallForm from '../src/components/forms/HInstallForm.vue'
const onInstall = (payload)=> {
  console.log(payload);
}
</script>
