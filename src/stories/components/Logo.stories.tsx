import type { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

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
      options: ['xs', 's', 'm', 'l'],
      description: '로고의 크기를 선택합니다.',
    },
    navigateOnClick: {
      control: 'boolean',
      description: '클릭 시 홈으로 이동할지 여부입니다.',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
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
 * 클릭 가능한 로고입니다. 클릭 시 홈으로 이동합니다.
 */
export const Clickable = Template.bind({})
Clickable.args = {
  size: 'm',
  navigateOnClick: true,
}

/**
 * 모든 크기의 로고를 비교할 수 있는 스토리입니다.
 */
export const AllSizes = () => (
  <div className="flex flex-col items-center gap-8">
    <div className="flex items-center gap-4">
      <Logo size="xs" />
      <span className="text-sm text-gray-600">xs</span>
    </div>
    <div className="flex items-center gap-4">
      <Logo size="s" />
      <span className="text-sm text-gray-600">s</span>
    </div>
    <div className="flex items-center gap-4">
      <Logo size="m" />
      <span className="text-sm text-gray-600">m</span>
    </div>
    <div className="flex items-center gap-4">
      <Logo size="l" />
      <span className="text-sm text-gray-600">l</span>
    </div>
  </div>
)