<template>
  <div class="container">
    <p
      v-if="label !== undefined"
      class="label"
      :class="{ required }"
      :style="[{ width: maxLabelWidth + 'px' }, labelStyle]"
    >
      {{ label }}
      <el-tooltip v-if="tip" popper-class="popper-tooltip" :content="tip">
        <el-icon class="tip-icon el-icon-close"><InfoFilled /></el-icon>
      </el-tooltip>
    </p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "normal-container",
  props: ["label", "maxLabelWidth", "required", "tip", "labelStyle"],
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}
.label {
  display: flex;
  flex-shrink: 0;
  margin-right: 8px;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
  color: var(--el-text-color-primary);
}
.required::after {
  content: "*";
  color: var(--el-color-error, var(--lcode-color-error));
  font-size: 12px;
  margin-left: 4px;
}
.tip-icon {
  margin-left: 2px;
  margin-right: 2px;
  color: #999;
  cursor: pointer;
}
</style>
