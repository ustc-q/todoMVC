import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'


// const mapStateToProps = state => {
//   // state 即 vuex 的总状态，在 reducer/index.js 中定义
//   return {
//     // 根据完成状态，筛选数据
//     todos: getVisibleTodos(state.todos, state.visibilityFilter)
//   }
// }

const mapDispatchToProps = dispatch => {
  return {
    // 切换完成状态
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}

// connect 高阶组件，将 state 和 dispatch 注入到组件 props 中
const VisibleTodoList = connect(
  // mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList