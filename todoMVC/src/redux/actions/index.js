// let nextTodoId = 0

export const addTodo = text => {
  return {
    type: 'ADD_TODO',
    id: parseInt(Math.random().toString().slice(-5)),
    text
  }
}
export const deleteTodo = id => {
  return {
    type: 'DELETE_TODO',
    id
  }
}
export const ModifyTodo = (id, text) => {
  return {
    type: 'MODIFY_TODO',
    id, 
    text
  }
}
export const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}
export const clearTodo = () => {
  return {
    type: 'CLEAR_TODO'
  }
}
export const toggleIsLogin = (isLogin) => {
  return {
    type: 'TOGGLE_ISLOGIN',
    isLogin
  }
}
export const toggleIsLocalStorage= (isLocalStorage) => {
  return {
    type: 'TOGGLE_ISLOCALSTORAGE',
    isLocalStorage
  }
}
// // 设置完成状态
export const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}