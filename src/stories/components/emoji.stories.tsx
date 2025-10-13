import type { Meta, StoryFn } from '@storybook/react'

import Emoji from '@/components/emoji'

export default {
  title: 'Components/Emoji',
  component: Emoji,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 's', 'm', 'l', 'xl'],
      description: '이모지의 크기를 선택합니다.',
    },
    number: {
      control: { type: 'number', min: 1, max: 40, step: 1 },
      description: '`/src/assets/emoji-icons/` 폴더에 있는 이모지 번호를 지정합니다.',
    },
    url: {
      control: 'text',
      description: '외부 이미지 URL을 직접 지정합니다. `number` prop보다 우선 적용됩니다.',
    },
    onClick: {
      action: 'clicked',
      description: '이모지 클릭 시 실행되는 이벤트입니다.',
    },
    className: {
      control: 'text',
      description: 'Tailwind CSS 클래스를 추가하여 스타일을 커스텀합니다.',
    },
  },
  tags: ['autodocs'],
} as Meta

const Template: StoryFn<typeof Emoji> = (args) => <Emoji {...args} />

/**
 * ### 기본 (중간 크기) 이모지
 * `number` prop을 사용하여 1번 이모지를 표시합니다.
 */
export const Default = Template.bind({})
Default.args = {
  size: 'l',
  number: 1,
}

/**
 * ### 작은 크기 이모지
 * `size` prop을 's'로 설정하여 작은 크기의 이모지를 표시합니다.
 */
export const Small = Template.bind({})
Small.args = {
  size: 's',
  number: 5,
}

/**
 * ### 큰 크기 이모지
 * `size` prop을 'l'로 설정하여 큰 크기의 이모지를 표시합니다.
 */
export const Large = Template.bind({})
Large.args = {
  size: 'l',
  number: 10,
}

/**
 * ### 클릭 가능한 이모지
 * `onClick` prop에 이벤트 핸들러를 전달할 수 있습니다.
 * 이모지를 클릭하면 Storybook의 **Actions** 탭에 'clicked' 로그가 기록됩니다.
 */
export const Clickable = Template.bind({})
Clickable.args = {
  size: 'm',
  number: 15,
  // onClick prop이 argTypes에 정의되어 있으므로, Controls에서 이벤트를 트리거할 수 있습니다.
}

/**
 * ### 외부 URL을 사용하는 이모지
 * `number` prop 대신 `url` prop을 사용하여 외부 이미지를 표시할 수 있습니다.
 */
export const FromURL = Template.bind({})
FromURL.args = {
  size: 'm',
  url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png',
}

/**
 * ### 커스텀 스타일이 적용된 이모지
 * `className` prop을 통해 Tailwind CSS 클래스를 추가하여 스타일을 확장할 수 있습니다.
 */
export const CustomStyled = Template.bind({})
CustomStyled.args = {
  size: 'm',
  number: 20,
  className: 'rounded-full bg-sky-200 p-4 shadow-xl',
}