export default function () {
  return {
    filter: {
      type: 'all',
      id: ''
    },
    sort: {
      key: 'date',
      ascend: false
    },
    loading: {
      show: true,
      text: 'Hexon 正在加载...'
    }
  }
}
