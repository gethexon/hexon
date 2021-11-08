<script lang="ts">
import { defineComponent, h, ref, computed } from "vue";
import { useResizeObserver } from "@vueuse/core";
const useStepper = (total: number) => {
  const current = ref(0);
  const isFirst = computed(() => current.value === 0);
  const isLast = computed(() => current.value === total - 1);
  const next = () => {
    if (total === 0) return;
    if (isLast.value) return;
    else current.value += 1;
  };
  const prev = () => {
    if (isFirst.value) return;
    else current.value -= 1;
  };
  return {
    current: computed(() => current.value),
    next,
    prev,
    isFirst,
    isLast,
    total,
  };
};
export default defineComponent({
  name: "Stepper",
  setup(props, { slots }) {
    const total = slots.default?.().length || 0;
    const stepper = useStepper(total);
    const containerRef = ref(null);
    const rect = ref({ width: 0, height: 0 });
    useResizeObserver(containerRef, (entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      rect.value = { width, height };
    });
    const translateX = computed(() => stepper.current.value * rect.value.width);
    return () => {
      const children =
        slots.default?.({
          ...stepper,
        }) || [];
      return h(
        "div",
        {
          style: {
            overflow: "hidden",
          },
        },
        h(
          "div",
          {
            ref: containerRef,
            style: {
              height: "100%",
              display: "flex",
              transform: `translateX(-${translateX.value}px)`,
              transition: "all 0.5s",
            },
          },
          children.map((value, index) => {
            const style = {
              height: "100%",
              flex: "0 0 100%",
            };
            if (
              stepper.current.value - 1 <= index &&
              index <= stepper.current.value + 1
            )
              return h(value, { style });
            else
              return h("div", {
                style: { ...style, backgroundColor: "black" },
              });
          })
        )
      );
    };
  },
});
</script>
