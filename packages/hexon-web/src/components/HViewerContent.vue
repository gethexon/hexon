<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming";
import { computed, toRefs } from "vue-demi";
import { HTheme } from "~/themes";

const props = defineProps<{
  content?: string;
}>();
const theme = useTheme<HTheme>()!;
const { content } = toRefs(props);
const styleVars = computed(() => ({
  primary: theme.value.color.primary.n,
}));
</script>
<template>
  <div class="article-entry" v-html="content || ''"></div>
</template>
<style lang="stylus">

// Colors
color-default = #555
color-grey = #999
color-border = #ddd
color-link = v-bind('styleVars.primary')
color-background = #eee
color-sidebar-text = #777
color-widget-background = #ddd
color-widget-border = #ccc
color-footer-background = #262a30
color-mobile-nav-background = #191919
color-twitter = #00aced
color-facebook = #3b5998
color-pinterest = #cb2027
color-linkedin = #0077B5

// Fonts
font-mono = "Source Code Pro", Consolas, Monaco, Menlo, Consolas, monospace
font-size = 14px
line-height = 1.6em
line-height-title = 1.1em

// Header
logo-size = 40px
subtitle-size = 16px
banner-height = 300px
banner-url = hexo-config("banner")

sidebar = hexo-config("sidebar")

// Layout
block-margin = 50px
article-padding = 20px
mobile-nav-width = 280px
main-column = 9
sidebar-column = 3

if sidebar and sidebar isnt bottom
  _sidebar-column = sidebar-column
else
  _sidebar-column = 0

// Grids
column-width = 80px
gutter-width = 20px
columns = main-column + _sidebar-column

// Media queries
mq-mobile = "screen and (max-width: 479px)"
mq-tablet = "screen and (min-width: 480px) and (max-width: 767px)"
mq-normal = "screen and (min-width: 768px)"

$base-style
  h1
    font-size: 2em
  h2
    font-size: 1.5em
  h3
    font-size: 1.3em
  h4
    font-size: 1.2em
  h5
    font-size: 1em
  h6
    font-size: 1em
    color: color-grey
  hr
    border: 1px dashed color-border
  strong
    font-weight: bold
  em, cite
    font-style: italic
  sup, sub
    font-size: 0.75em
    line-height: 0
    position: relative
    vertical-align: baseline
  sup
    top: -0.5em
  sub
    bottom: -0.2em
  small
    font-size: 0.85em
  acronym, abbr
    border-bottom: 1px dotted
  ul, ol, dl
    margin: 0 20px
    line-height: line-height
  ul, ol
    ul, ol
      margin-top: 0
      margin-bottom: 0
  ul
    list-style: disc
  ol
    list-style: decimal
  dt
    font-weight: bold

.article-entry
  @extend $base-style
  margin: 0 auto
  max-width: 768px
  clearfix()
  color: color-default
  padding: 0 article-padding
  p, table
    line-height: line-height
    margin: line-height 0
  h1, h2, h3, h4, h5, h6
    font-weight: bold
  h1, h2, h3, h4, h5, h6
    line-height: line-height-title
    margin: line-height-title 0
  a
    color: color-link
    text-decoration: none
    &:hover
      text-decoration: underline
  ul, ol, dl
    margin-top: line-height
    margin-bottom: line-height
  img, video
    max-width: 100%
    height: auto
    display: block
    margin: auto
  iframe
    border: none
  table
    width: 100%
    border-collapse: collapse
    border-spacing: 0
  th
    font-weight: bold
    border-bottom: 3px solid color-border
    padding-bottom: 0.5em
  td
    border-bottom: 1px solid color-border
    padding: 10px 0
  blockquote
    font-size: 1.4em
    margin: line-height 20px
    text-align: center
    footer
      font-size: font-size
      margin: line-height 0
      cite
        &:before
          content: "—"
          padding: 0 0.5em
  .pullquote
    text-align: left
    width: 45%
    margin: 0
    &.left
      margin-left: 0.5em
      margin-right: 1em
    &.right
      margin-right: 0.5em
      margin-left: 1em
  .caption
    color: color-grey
    display: block
    font-size: 0.9em
    margin-top: 0.5em
    position: relative
    text-align: center
  // http://webdesignerwall.com/tutorials/css-elastic-videos
  .video-container
    position: relative
    padding-top: (9 / 16 * 100)% // 16:9 ratio
    height: 0
    overflow: hidden
    iframe, object, embed
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      margin-top: 0

// https://github.com/chriskempson/tomorrow-theme
highlight-background = #2d2d2d
highlight-current-line = #393939
highlight-selection = #515151
highlight-foreground = #cccccc
highlight-comment = #999999
highlight-red = #f2777a
highlight-orange = #f99157
highlight-yellow = #ffcc66
highlight-green = #99cc99
highlight-aqua = #66cccc
highlight-blue = #6699cc
highlight-purple = #cc99cc

$code-block
  background: highlight-background
  margin: 0
  padding: 15px article-padding
  border-style: solid
  border-color: color-border
  border-width: 1px 0
  overflow: auto
  color: highlight-foreground
  line-height: font-size * line-height

$line-numbers
  color: #666
  font-size: 0.85em

.article-entry
  pre, code
    font-family: font-mono
  code
    background: color-background
    text-shadow: 0 1px #fff
    padding: 0 0.3em
  pre
    @extend $code-block
    code
      background: none
      text-shadow: none
      padding: 0
  .highlight
    @extend $code-block
    border-radius: 0.375rem
    pre
      border: none
      margin: 0
      padding: 0
    table
      margin: 0
      width: auto
    td
      border: none
      padding: 0
    figcaption
      clearfix()
      font-size: 0.85em
      color: highlight-comment
      line-height: 1em
      margin-bottom: 1em
      a
        float: right
    .gutter pre
      @extend $line-numbers
      text-align: right
      padding-right: 20px
    .line
      height: font-size * line-height
    .line.marked
      background: highlight-selection
  .gist
    margin: 0 article-padding * -1
    border-style: solid
    border-color: color-border
    border-width: 1px 0
    background: highlight-background
    padding: 15px article-padding 15px 0
    .gist-file
      border: none
      font-family: font-mono
      margin: 0
      .gist-data
        background: none
        border: none
        .line-numbers
          @extend $line-numbers
          background: none
          border: none
          padding: 0 20px 0 0
        .line-data
          padding: 0 !important
      .highlight
        margin: 0
        padding: 0
        border: none
      .gist-meta
        background: highlight-background
        color: highlight-comment
        font: 0.85em
        text-shadow: 0 0
        padding: 0
        margin-top: 1em
        margin-left: article-padding
        a
          color: color-link
          font-weight: normal
          &:hover
            text-decoration: underline

pre
  .comment
  .title
    color: highlight-comment
  .variable
  .attribute
  .tag
  .regexp
  .ruby .constant
  .xml .tag .title
  .xml .pi
  .xml .doctype
  .html .doctype
  .css .id
  .css .class
  .css .pseudo
    color: highlight-red
  .number
  .preprocessor
  .built_in
  .literal
  .params
  .constant
    color: highlight-orange
  .class
  .ruby .class .title
  .css .rules .attribute
    color: highlight-green
  .string
  .value
  .inheritance
  .header
  .ruby .symbol
  .xml .cdata
    color: highlight-green
  .css .hexcolor
    color: highlight-aqua
  .function
  .python .decorator
  .python .title
  .ruby .function .title
  .ruby .title .keyword
  .perl .sub
  .javascript .title
  .coffeescript .title
    color: highlight-blue
  .keyword
  .javascript .function
    color: highlight-purple
</style>
<style lang="less">
.highlight tr {
  border-top: none;
}
</style>
