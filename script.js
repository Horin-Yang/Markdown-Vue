// 时间过滤器
Vue.filter('date', time => moment(time)
.format('DD/MM/YY, HH:mm'))

// New VueJS instance
new Vue({
  name: 'notebook',

  // CSS selector of the root DOM element
  el: '#notebook',

  // Some data
  data () {
    return {
      // content: 'This is a note',
      content: localStorage.getItem('content') || 'You can write in **markdown**',
      // 新的一个笔记数组
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      // 选中笔记的ID
      selectedId: localStorage.getItem('selected-id') || null,
    }
  },

  // Computed properties
  computed: {
    selectedNote () {
      console.log(this.notes)
      // 返回与selectedId匹配的笔记
      return this.notes.find(note => note.id === this.selectedId)
    },

    notePreview () {
      console.log(marked(this.selectedNote.content))
      // Markdown rendered to HTML
      // return marked(this.content)
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },

    // addButtonTitle () {
    //   return notes.length + ' note(s) already'
    // },

    sortedNotes () {
      return this.notes.slice()
      .sort((a, b) => a.created - b.created)
      .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
    },

    linesCount () {
      if (this.selectedNote) {
        // 计算换行符个数
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },

    wordsCount () {
      if (this.selectedNote){
        var s = this.selectedNote.content
        // 将换行符换为空格
        s = s.replace(/\n/g, ' ')
        // 排除开头结尾的空格
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        // 将多个重复空格转换为一个
        s = s.replace(/\s\s+/gi, ' ')
        // 返回空格数量
        return s.split(' ').length
      }
    },

    charactersCount () {
      if (this.selectNote) {
        return this.selectedNote.content.split('').length
      }
    },
  },

  // Change watchers
  watch: {
    // content: {
    //   handler (val, oldVal) {
    //     console.log('new note:', val, 'old note:', oldVal)
    //     localStorage.setItem('content', val)
    //   },
    //   immediate: true,
    // },

    // 简写
    // content (val, oldVal) {
    //   console.log('new note:', val, 'old note:', oldVal)
    // },

    /*content (val) {
      localStorage.setItem('content', val)
    },*/

    /*content: {
      handler: 'saveNote',
    },*/

    content: 'saveNote',
    // notes: 'saveNotes',
    notes: {
      // 方法名
      handler:'saveNotes',
      // 需要使用这个选项来侦听数组中每个笔记属性的变化
      deep: true,
    },

    // 保存选中项
    selectedId (val) {
      localStorage.setItem('selected-id', val)
    },
  },

  methods: {
    // 复用方法，把保存笔记的逻辑同意写在 savenote 函数里以便复用
    saveNote (val, oldVal) {
      console.log('new note:', val, 'old note:', oldVal)
      console.log('saving note:', this.content)
      localStorage.setItem('content', this.content)
      this.reportOperation('saving')
    },
    reportOperation (opName) {
      console.log('The', opName, 'operation was completed!')
    },

    // 用一些默认值添加一条笔记，并将其添加到数组中
    addNote() {
      const time = Date.now()
      // 新笔记默认值
      const note = {
        id: String(time),
        title: 'New note' + (this.notes.length + 1),
        content: '**Hi!** This notebook is using[markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        created: time,
        favorite: false,
      }
      // 添加到列表中
      this.notes.push(note)
    },

    selectNote (note) {
      this.selectedId = note.id
      console.log(this.selectedId)
    },
    saveNotes () {
      // 在储存前记住把对象转换成json字符串
      localStorage.setItem('notes', JSON.stringify(this.notes))
      console.log('Notes saved!', new Date())
    },

    removeNote () {
      if (this.selectedNote && confirm("Delete the note ?")) {
        // 将选中的笔记从列表中移除
        const index = this.notes.indexOf(this.selectedNote)  // 获取下标
        if (index !== -1) {
          this.notes.splice(index, 1)
        }
      }
    },

    // 反转 favorite 布尔数属性
    favoriteNote () {
      // 原始写法
      // this.selectedNote.favorite = !this.selectedNote.favorite
      // 异或运算符
      // this.selectedNote.favorite = this.selectedNote.favorite ^ true
      // 简写
      this.selectedNote.favorite ^= true
    }
  },

  /* created () {
    this.content = localStorage.getItem('content') || 'You can write in **markdown**'
  }, */
})
