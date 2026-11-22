import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('컴포넌트가 정상적으로 생성된다', () => {
    const wrapper = mount(App)

    expect(wrapper.exists()).toBe(true)
  })
})