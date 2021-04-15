export default function () {
  return {
    posts: {
      loading: false,
      data: {
        // xxx: {
        //   status: 'ready', // 'edited', 'saving','loading',
        //   data: {
        //     xxx: xxx
        //   },
        //   modify: {},
        //   saved: {}
        //   err: ''
        // }
      },
      err: ''
    },
    pages: {
      loading: false,
      data: {},
      err: ''
    },
    tags: {
      loading: false,
      data: {},
      err: ''
    },
    categories: {
      loading: false,
      data: {},
      err: ''
    },
    creating: {}
  }
}
