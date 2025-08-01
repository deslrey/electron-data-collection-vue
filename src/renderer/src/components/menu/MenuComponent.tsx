import AntIcon from '@renderer/utils/AntIcon'
import { defineComponent } from 'vue'

export const MenuItem = defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    return () => {
      if (props.item.children && props.item.children.length) {
        return (
          <el-sub-menu index={props.item.path}>
            {{
              title: () => (
                <>
                  <AntIcon type={props.item.icon} style="margin-right: 8px;" />
                  {props.item.name}
                </>
              ),
              default: () => props.item.children.map((child: any) => <MenuItem item={child} />)
            }}
          </el-sub-menu>
        )
      } else {
        return (
          <el-menu-item index={props.item.path}>
            <AntIcon type={props.item.icon} style="margin-right: 8px;" />
            {props.item.name}
          </el-menu-item>
        )
      }
    }
  }
})
