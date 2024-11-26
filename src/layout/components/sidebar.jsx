import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { sensorsList } from '@/utils/sensors'

export default {
  name: 'Sidebar',
  props: ['data'],
  methods: {
    async changeRouter(data) {
      await this.$router.push({
        path: data.index
      })
      sensorsList.sfzc_navigation_subMenu.call(this)
    },
    openSubMenu(data) {
      sensorsList.sfzc_navigation_priMenu(data)
    }
  },
  computed: {
    isCollapse() {
      return !this.$store.state.app.sidebarOpened
    }
  },
  data() {
    return {
      defaultIndex: this.$route.path,
    }
  },
  watch: {
    $route() {
      this.defaultIndex = this.$route.path
    }
  },
  render() {
    const MenuItem = ({ meta = {}, path, code }) => {
      const icon = meta.icon
      const IconNode = ElementPlusIconsVue[icon]
      return (
        <el-menu-item class={[`menu-code-${code}`]} onClick={this.changeRouter} index={path}>
          {
            icon ? <el-icon><IconNode /></el-icon> : null
          }
          { this.isCollapse && meta.collapseTitle === false ? '' : meta.title}
        </el-menu-item>
      )
    }
    const SubMenuItem = (data) => {
      if (!data.children || !data.children.length) {
        return <MenuItem {...data}></MenuItem>
      } else {
        return (
          <el-sub-menu class={[`menu-code-${data.code}`]} index={data.path}>
            {{
              title: () => {
                const icon = data.meta.icon
                const IconNode = ElementPlusIconsVue[icon]
                return (
                  <div className={[`menu-code-${data.code}`]}>
                    {
                      icon ? <el-icon><IconNode /></el-icon> : null
                    }
                    {this.isCollapse ? '' : data.meta.title}
                  </div>
                )
              },
              default: () => (
                data.children.map((i) => (
                  <SubMenuItem {...i}></SubMenuItem>
                ))
              )
            }}
          </el-sub-menu>
        )
      }
    }
    return (
      <el-menu
        default-active={this.defaultIndex}
        collapse={this.isCollapse}
        router
        onOpen={this.openSubMenu}
        class="el-menu-vertical-demo slider-menu"
      >
        {
          this.data.map((item) => {
            return <SubMenuItem {...item}></SubMenuItem>
          })
        }
      </el-menu>
    )
  }
}
