# Scss

## 指令

### @mixin and @include
@mixin 用于复用

@include 用于引入
```scss
// input
@mixin reset-list
  margin: 0
  padding: 0
  list-style: none


@mixin horizontal-list
  @include reset-list

  li
    display: inline-block
    margin:
      left: -2px
      right: 2em




nav ul
  @include horizontal-list

// output
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav ul li {
  display: inline-block;
  margin-left: -2px;
  margin-right: 2em;
}
```

### @use
1. 不管使用了多少次样式表，@use 都只会引入和执行一次
2. 与全局使用相反，@use 是有命名空间的，而且只在当前样式表中生效
3. 以 -或者 _开头的命名空间被认为是私有的，不会被引入其他样式表

定义命名空间
```scss
// base-style.scss
$font-size: 20px;
$column-width: 100px;
* {
  margin: 0;
  padding: 0;
  font-size: $font-size;
  color: #333;
}

@function column-width($width) {
  @return $column-width + $width;
}

@mixin bgColor($bg-color: #f2f2f2) {
  background-color: $bg-color;
}

// index.scss
@use "base-style" as baseStyle;
/*访问baseStyle模块中的数据*/ 
div {
  font-size: baseStyle.$font-size;
  width: baseStyle.column-width(100px);
  @include baseStyle.bgColor();
}
```

### @import
1. 使用了多次样式表，@import 回被多次执行和引入
2. 即将被废弃

### @forward
1. 可以把 scss 文件内容引入到另一个 scss 中
```scss
// input
// src/_list.scss
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
// bootstrap.scss
@forward "src/list";
// styles.scss
@use "bootstrap";

li {
  @include bootstrap.list-reset;
}

// output
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
```
2. Adding a Prefix
```scss
// input
// src/_list.scss
@mixin reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
// bootstrap.scss
@forward "src/list" as list-*;
// styles.scss
@use "bootstrap";

li {
  @include bootstrap.list-reset;
}

// output
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
```
3. hide, show 可以用来表示哪些成员可以不被使用或者可以被使用
```scss
// input
// src/_list.scss
$horizontal-list-gap: 2em;

@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin list-horizontal {
  @include list-reset;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: $horizontal-list-gap;
    }
  }
}

// output
// bootstrap.scss
@forward "src/list" hide list-reset, $horizontal-list-gap;
```
4. 可以在其配置中使用!default标志。这允许模块更改上游样式表的默认值，同时仍然允许下游样式表覆盖它们。
```scss
// input
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
// _opinionated.scss
@forward 'library' with (
  $black: #222 !default,
  $border-radius: 0.1rem !default
);
// style.scss
@use 'opinionated' with ($black: #333);

// output
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(51, 51, 51, 0.15);
}
```

### @extend
继承样式
```scss
// input
.error {
  border: 1px #f00;
  background-color: #fdd;

  &--serious {
    @extend .error;
    border-width: 3px;
  }
}

// output
.error, .error--serious {
  border: 1px #f00;
  background-color: #fdd;
}
.error--serious {
  border-width: 3px;
}
```
### @function
```scss
@function add($arg1, $arg2) {
  @return $arg1 + $arg2;
}

div {
  font-size: add(14px, 2px); // 输出 16px
}
```
### @at-root
用于在嵌套规则中跳出父级规则，并将样式应用于根级别。通常情况下，CSS 规则都是嵌套在父级规则中的，而 @at-root 可以让开发者在需要时跳出这种嵌套结构

@at-root 只能用于属性和选择器，不能用于声明块中的语句，如变量声明、函数定义等
```scss
// input
.parent {
  .child {
    font-size: 16px;
    @at-root .sibling {
      font-weight: bold;
    }
  }
}

// output
.parent .child {
  font-size: 16px;
}

.sibling {
  font-weight: bold;
}
```
