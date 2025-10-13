import type { Meta, StoryFn } from '@storybook/react'

import Logo from '@/components/Logo.tsx'

export default {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 's', 'm', 'l', 'xl'],
      description: '로고의 크기를 선택합니다.',
    },
    onClick: {
      action: 'clicked',
      description: '로고 클릭 시 실행되는 이벤트입니다.',
    },
  },
} as Meta

const Template: StoryFn<typeof Logo> = (args) => <Logo {...args} />

/**
 * 기본 (중간 크기) 로고입니다.
 */
export const Default = Template.bind({})
Default.args = {
  size: 'm',
}

/**
 * 작은 크기의 로고입니다.
 */
export const Small = Template.bind({})
Small.args = {
  size: 's',
}

/**
 * 큰 크기의 로고입니다.
 */
export const Large = Template.bind({})
Large.args = {
  size: 'l',
}

/**
 * 클릭 이벤트가 있는 로고입니다. 클릭 시 Storybook의 Actions 탭에 기록됩니다.
 */
export const Clickable = Template.bind({})
Clickable.args = {
  size: 'm',
  // onClick prop을 전달하면 action('clicked')가 자동으로 이벤트를 잡아줍니다.
}