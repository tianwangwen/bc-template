export default {
  name: 'Sidebar',
  props: ['data'],
  methods: {
    async changeRouter(data) {
      await this.$router.push({
        path: data.index
      })
    }
  },
  computed: {},
  data() {
    return {
      defaultIndex: this.$route.path
    }
  },
  watch: {
    $route() {
      this.defaultIndex = this.$route.path
    }
  },
  mounted() {
    // this.$store.dispatch('app/getWarningNum')
  },
  render() {
    const MenuIcon = ({ name }) => {
      return <span class={'menu-icon menu-icon-' + name} />
    }

    const MenuItem = ({ meta = {}, path }) => {
      const icon = meta.icon
      return (
        <el-menu-item onClick={this.changeRouter} index={path}>
          {icon ? (
            <el-icon>
              <MenuIcon name={icon} />
            </el-icon>
          ) : null}
          {meta.title}
          {
            (path === '/real-time-warning' && !!this.$store.state.app.warningNum) && <div class="tagNum"><p>{this.$store.state.app.warningNum > 99 ? '99+' : this.$store.state.app.warningNum}</p></div>
          }
        </el-menu-item>
      )
    }
    const SubMenuItem = data => {
      if (!data.children || !data.children.length) {
        return <MenuItem {...data}></MenuItem>
      } else {
        return (
          <el-sub-menu index={data.path}>
            {{
              title: () => {
                const icon = data.meta.icon
                return (
                  <div>
                    {icon ? (
                      <el-icon>
                        <MenuIcon name={icon} />
                      </el-icon>
                    ) : null}
                    {data.meta.title}
                  </div>
                )
              },
              default: () => data.children.map(i => <SubMenuItem {...i}></SubMenuItem>)
            }}
          </el-sub-menu>
        )
      }
    }
    return (
      <el-menu default-active={this.defaultIndex} collapse={false} router class={'slider-menu'}>
        {this.data.map(item => {
          return <SubMenuItem {...item}></SubMenuItem>
        })}
      </el-menu>
    )
  }
}
