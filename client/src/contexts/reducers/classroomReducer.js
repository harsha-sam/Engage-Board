import {
  LOAD_CLASSROOM,
  LOAD_CLASSROOM_REQUESTS,
  SET_IS_LOADING,
  SET_CONTENT_MODERATION,
  ADD_CHANNEL_TO_CLASSROOM,
  REMOVE_CHANNEL_FROM_CLASSROOM,
  UPDATE_CHANNEL_OF_CLASSROOM,
  ADD_MEMBER_TO_CLASSROOM,
  REMOVE_MEMBER_FROM_CLASSROOM
} from '../actionTypes';

export const classroomInitialState = {
  id: '',
  name: '',
  description: '',
  members: {},
  total_members: 0,
  requests: [],
  isLoading: false,
  is_moderation_enabled: false,
}

export const classroomReducer = (state = classroomInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSROOM: {
      return ({ ...state, ...payload, isLoading: false })
    }
    case LOAD_CLASSROOM_REQUESTS: {
      return ({ ...state, requests: payload, isLoading: false })
    }
    case SET_IS_LOADING: {
      return ({ ...state, isLoading: payload })
    }
    case SET_CONTENT_MODERATION: {
      return ({ ...state, ...payload })
    }
    case ADD_CHANNEL_TO_CLASSROOM: {
      let {
        category,
        id: channel_id,
        name: channel_name,
        message_permission
      } = payload;
      let newChannel = {id: channel_id, name: channel_name, message_permission}
      let newCategories = [...state.categories];
      let existingCategoryIndex = newCategories.findIndex((cat) => cat.id === category.id)
      if (existingCategoryIndex !== -1) {
        let existingCategory = { ...newCategories[existingCategoryIndex] };
        existingCategory.channels = [...existingCategory.channels, newChannel];
        newCategories[existingCategoryIndex] = existingCategory;
      }
      else {
        category.channels = [newChannel];
        newCategories.push(category);
      }
      return ({...state, categories: newCategories})
    }
    case REMOVE_CHANNEL_FROM_CLASSROOM: {
      let {
        category_id,
        id: channel_id,
      } = payload;
      let newCategories = [...state.categories];
      let existingCategoryIndex = newCategories.findIndex((cat) => cat.id === category_id)
      if (existingCategoryIndex !== -1) {
        let existingCategory = { ...newCategories[existingCategoryIndex] };
        existingCategory.channels = existingCategory.channels.filter((channel) => channel.id !== channel_id)
        newCategories[existingCategoryIndex] = existingCategory;
        if (existingCategory.channels.length === 0) {
          newCategories.splice(existingCategoryIndex, 1);
        }
      }
      return ({ ...state, categories: newCategories })
    }
    case UPDATE_CHANNEL_OF_CLASSROOM: {
      let { prev_category_id, category_id, id, name, message_permission } = payload;
      let newCategories = [...state.categories];
      let existingCategoryIndex = -1;
      let updatedCategoryIndex = -1;
      for (let index = 0; index < newCategories.length; index++) {
        let cat = newCategories[index];
        if (cat.id === prev_category_id) {
          existingCategoryIndex = index
        }
        if (cat.id === category_id) {
          updatedCategoryIndex = index
        }
        if (existingCategoryIndex !== -1 && updatedCategoryIndex !== -1)
          break
      }
      if (existingCategoryIndex !== updatedCategoryIndex) {
        let existingCategory = { ...newCategories[existingCategoryIndex] };
        existingCategory.channels = existingCategory.channels.filter((channel) => channel.id !== id)
        newCategories[existingCategoryIndex] = existingCategory;
      }
      let updatedCategory= { ...newCategories[updatedCategoryIndex] }
      updatedCategory.channels = updatedCategory.channels.filter((channel) => channel.id !== id)
      updatedCategory.channels.push({ id, name, message_permission })
      newCategories[updatedCategoryIndex] = updatedCategory;
      return ({ ...state, categories: newCategories })
    }
    case ADD_MEMBER_TO_CLASSROOM: {
      let newMembers = { ...state.members, [payload.id]: payload }
      return ({ ...state, members: newMembers })
    }
    case REMOVE_MEMBER_FROM_CLASSROOM: {
      let newMembers = { ...state.members }
      delete newMembers[payload.id]
      return ({ ...state, members: newMembers })
    }
    default:
      return state
  }
}
