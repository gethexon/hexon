---
to: src/components/<%= name %>.stories.ts
---
import { Meta, Story } from "@storybook/vue3/types-6-0";
import <%= name %> from "./<%= name %>.vue";

export default {
  title: "<%= name %>",
  component: <%= name %>,
} as Meta;

const Template: Story = (args) => ({
  components: { <%= name %> },
  setup() {
    return { args };
  },
  template: `<<%= name %> v-bind="args"></<%= name %>>`,
});

export const Normal<%= name %> = Template.bind({});

Normal<%= name %>.args = {
  name: "<%= name %>",
};
