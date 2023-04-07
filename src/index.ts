import './style/import_demo.scss'
import './style/use_demo.scss' // @use 和 @import 打包后的结果对比 ./result/@use_@import_distinctio.png

const sum = (n1: number, n2: number) => {
  return n1 + n2
}

console.log(sum(1, 2))