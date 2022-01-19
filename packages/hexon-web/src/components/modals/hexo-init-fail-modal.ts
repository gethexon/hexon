import { defineComponent, h } from "vue"
import HHexoInitFailModal from "@/modals/HHexoInitFailModal.vue"
import HBaseModal from "@/ui/modal/src/HBaseModal.vue"
import modal from "~/plugins/modal"

export default function showHexoInitFailModal(text: string) {
  modal.create(
    defineComponent({
      name: "HErrorInfo",
      components: {
        HHexoInitFailModal,
        HBaseModal,
      },
      props: {
        close: Function,
      },
      render() {
        return h(
          HBaseModal,
          {
            onOnClose: this.close,
          },
          () => h(HHexoInitFailModal, { text })
        )
      },
    })
  )
}
