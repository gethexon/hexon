---
to: src/components/<%= name %>.stories.mdx
---
import { Meta, Story, Canvas } from "@storybook/addon-docs";

import <%= name %> from "./<%= name %>.vue";

<Meta
  title="<%= name %>"
  component={<%= name %>}
  name="<%= name %>"
  argTypes={{}}
/>

# <%= name %>

## 基础

<Canvas>
  <Story name="基础">{
  () => ({
    components: { <%= name %> },
    template: `<<%= name %> name="<%= name %>"></<%= name %>>`,
  })  
  }</Story>
</Canvas>
