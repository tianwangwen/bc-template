export default {
  name: 'form-item-range',
  inject: {
    emitPublish: {
      default: () => {}
    },
    formNode: {
      default: () => ({})
    },
    tablePageNode: {
      default: () => ({})
    },
    pageNode: {
      default: () => null,
    }
  },
  emits: ['validate'],
  props: ['size', 'itemkey', 'data', 'on', 'itemProps', 'formItemWidth', 'i18nGlobal'],
  render(h) {
    return (
      <div>
        <el-input
          size={this.size}
          placeholder={this.data['start-placeholder'] || this.i18nGlobal.t('请输入')}
          v-model={this.data.value.min}
          {...this.itemProps(['start-placeholder', 'end-placeholder', 'split', 'value', 'style'])}
          style={{ width: this.formItemWidth, ...this.data.style }}
          onInput={e => this.emitPublish(this.itemkey, e)}
          onBlur={this.$emit('validate')}
          onClear={this.$emit('validate')}
        />
        <span style={{ margin: '0 4px' }}>{ this.data.split }</span>
        <el-input
          size={this.size}
          placeholder={this.data['end-placeholder'] || this.i18nGlobal.t('请输入')}
          v-model={this.data.value.max}
          {...this.itemProps(['start-placeholder', 'end-placeholder', 'split', 'value', 'style'])}
          style={{ width: this.formItemWidth, ...this.data.style }}
          onInput={e => this.emitPublish(this.itemkey, e)}
          onBlur={this.$emit('validate')}
          onClear={this.$emit('validate')}
        />
      </div>
    )
  }
}
