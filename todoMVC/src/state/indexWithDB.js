import React from 'react'
import Input from './Input'
import List from './List'
import axios from 'axios'

class State extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      completedChanged: false,
      titleUpdated: false,
      isLocalStorage: false,
      user: {
        // uid: '',
        // username: ''
      },
      list: [
        // {
        //   id: '',
        //   title: '',
        //   completed: false
        // }
      ]
    }
  }
  
  render() {
    if (!this.props.isLogin) {
      return <div>
        <h2>请先登录！</h2>
      </div>
    }
    return <div>
      <Input addItem={this.addItem}></Input>
      <List list={this.state.list}
        deleteItem={this.deleteItem}
        toggleCompleted={this.toggleCompleted}
        updateListValue={this.updateListValue}
        isLogin={this.props.isLogin}
      />
    </div>
  }

  // 新增一项
  addItem = (title) => {
    const list = this.state.list
    let listItem = {
      uid: this.state.user.uid,
      id: Math.random().toString().slice(-5), // id 累加
      title,
      completed: false
    }
    console.log(listItem)
    if (this.state.isLocalStorage) {
      console.log('add todoItem to local', title)
      this.setState({
        // 使用 concat 返回不可变值
        list: list.concat(listItem)
      })
    }
    else {
      this.setState({
        // 使用 concat 返回不可变值
        list: list.concat(listItem)
      })
      console.log('add todoItem to server', title)
      axios({
        method: 'post',
        url: 'todo',
        data: listItem
      })
        .then(function (response) {
          console.log('res', response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 删除一项
  deleteItem = (id) => {
    if (this.state.isLocalStorage) {
      console.log('delete from local', id)
      this.setState({
        // 使用 filter 返回不可变值
        list: this.state.list.filter(item => item.id !== id)
      })
    }
    else {
      this.setState({
        // 使用 filter 返回不可变值
        list: this.state.list.filter(item => item.id !== id)
      })
      console.log('delete from server', id)
      axios({
        method: 'delete',
        url: 'todo',
        data: {
          uid: this.state.user.uid,
          id: id
        }
      })
        .then(function (response) {
          console.log('res', response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 切换完成状态
  toggleCompleted = (id) => {
    if (this.state.isLocalStorage) {
      console.log('update completedStatus to local')
      this.setState({
        completedChanged: !this.state.completedChanged,
        // 使用 map 返回不可变值
        list: this.state.list.map(item => {
          const completed = item.id === id
            ? !item.completed
            : item.completed // 切换完成状态
          // 返回新对象
          return {
            ...item,
            completed
          }
        })
      })
    }
    else {
      console.log('update completedStatus to server')
      let newCompleted = !this.state.list.find((item) => item.id === id).completed
      console.log('toggleCompleted', newCompleted)
      this.setState({
        completedChanged: !this.state.completedChanged,
        // 使用 map 返回不可变值
        list: this.state.list.map(item => {
          const completed = item.id === id
            ? !item.completed
            : item.completed // 切换完成状态
          // 返回新对象
          return {
            ...item,
            completed
          }
        })
      })
      axios({
        method: 'patch',
        url: 'todo',
        data: {
          uid: this.state.user.uid,
          id: id,
          completed: newCompleted
        }
      })
        .then(function (response) {
          console.log('res', response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 更新title
  updateListValue = (id, val) => {
    // 可执行，视图也更新，但是db不变
    if (this.state.isLocalStorage) {
      console.log('update list value to local')
      this.setState({
        titleUpdated: !this.state.titleUpdated,
        list: this.state.list.map(item => {
          item.title = (item.id === id) ? val : item.title
          return item
        })
      })
    }
    else {
      this.setState({
        titleUpdated: !this.state.titleUpdated,
        list: this.state.list.map(item => {
          item.title = (item.id === id) ? val : item.title
          return item
        })
      })
      console.log('update list value to server')
      axios({
        method: 'put',
        url: 'todo',
        data: {
          uid: this.state.user.uid,
          id: id,
          title: val
        }
      })
        .then(function (response) {
          console.log('res', response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 读取数据 
  getData = () => {
    let that = this
    // console.log(that)
    if (this.state.isLocalStorage) {
      console.log('get data from local')
      var data = localStorage.getItem("todo");
      data = data !== null ? JSON.parse(data) : []
      that.setState({
        list: data
      }, () => { // 异步更新，回调中拿值
        console.log('list', this.state.list)
      })
    }
    else {
      console.log('get data from server', that.state.user.uid)
      axios.get('/todo', {
        params: {
          uid: that.state.user.uid
        }
      })
        .then(function (response) {
          console.log('res', response);
          that.setState({
            list: response.data.code === 1 ? response.data.data : []
          }, () => { // 异步更新，回调中拿值
            console.log('list', that.state.list)
          })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 保存数据
  saveData = (data) => {
    if (this.state.isLocalStorage) {
      console.log('save data to local')
      localStorage.setItem("todo", JSON.stringify(data));
    }
    else {
      console.log('save data to server, done')
    }
  }

  componentDidMount() {
    console.log('enter todo didMount', this.props)
    console.log('isLogin', this.props.isLogin)
    if (this.props.isLogin) {
      // // // this.props.location.search 是 ?uid=60649e73d11dac31585b67ff&name=jack
      // let arr = this.props.location.search.split('&') // ['?uid=60649e73d11dac31585b67ff', 'name=jack']
      // let uid = arr[0].substr(5)
      // let name = arr[1].substr(5)
      // console.log(uid, name)
      this.setState({
        user: this.props.user,
        isLocalStorage: this.props.isLocalStorage
      }, () => { // 异步更新，回调中拿值
        console.log('user', this.state.user, this.state.isLocalStorage)
        // this.getData()必须在回调中拿到最新的this.state.user，然后根据uid查询todoItem来渲染
        this.getData();
      })
    }
  }

  componentDidUpdate(preProps, preState) {
    console.log('enter todo didUpdate')
    if (this.state.list.length !== preState.list.length) {
      console.log('list length changed')
      this.saveData(this.state.list)
    }
    if (this.state.completedChanged !== preState.completedChanged) {
      console.log('completed Changed')
      this.saveData(this.state.list)
    }
    if (this.state.titleUpdated !== preState.titleUpdated) {
      console.log('title Updated')
      this.saveData(this.state.list)
    }
  }
}

export default State