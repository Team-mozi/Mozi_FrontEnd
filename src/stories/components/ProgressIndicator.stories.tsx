import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react'

import ProgressIndicator from '@/components/ProgressIndicator.tsx'

export default {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'radio',
      options: ['center', 'top', 'bottom'],
      description: '아이콘이 나타날 위치를 정합니다.',
    },
    size: {
      control: 'radio',
      options: ['s', 'm', 'l'],
      description: '아이콘의 크기를 조정합니다.',
    },
    isLoading: {
      control: 'boolean',
      description: 'true일 때 인디케이터가 활성화됩니다. (인터랙션 스토리에서는 내부 상태로 제어됩니다)',
    },
    text: {
      control: 'text',
      description: '아이콘 하단에 표시될 텍스트입니다.',
    },
    backgroundColor: {
      control: 'radio',
      options: ['gray', 'white'],
      description: '배경 오버레이의 색상을 지정합니다.',
    },
  },
} as Meta

/**
 * 기본 템플릿입니다. props를 직접 제어하여 UI를 확인하는 용도입니다.
 */
const Template: StoryFn<typeof ProgressIndicator> = (args) => (
  <div>
    {/* 뒷 배경 컨텐츠 예시 */}
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">페이지 컨텐츠</h1>
      <p className="mb-2">
        이 영역은 페이지의 실제 컨텐츠가 표시되는 곳입니다. Storybook Controls 탭에서 `isLoading`을 켜보세요.
      </p>
      <button className="px-4 py-2 text-white bg-blue-500 rounded-md">
        배경 버튼
      </button>
    </div>

    <ProgressIndicator {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  isLoading: true,
  position: 'center',
  size: 'm',
  text: '로딩 중...',
  backgroundColor: 'gray',
}


// --- 5초 후 사라지는 인터랙션 테스트를 위한 새로운 스토리 ---

/**
 * 인터랙션 템플릿입니다.
 * 버튼 클릭과 setTimeout을 통해 실제 비동기 로딩 상황을 시뮬레이션합니다.
 */
const InteractionTemplate: StoryFn<typeof ProgressIndicator> = (args) => {
  const [loading, setLoading] = useState(false)

  const handleLoadingStart = () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (loading) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000) // 5000ms = 5초
  }

  return (
    <div>
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">인터랙션 테스트</h1>
        <p className="mb-2">
          아래 버튼을 클릭하면 5초 동안 로딩 인디케이터가 나타납니다.
        </p>
        <button
          className="px-4 py-2 text-white bg-green-600 rounded-md disabled:bg-gray-400"
          onClick={handleLoadingStart}
          disabled={loading}
        >
          {loading ? '처리 중...' : '5초 로딩 시작'}
        </button>
      </div>

      {/* isLoading prop을 내부 상태(loading)로 제어합니다. */}
      <ProgressIndicator {...args} isLoading={loading} />
    </div>
  )
}

export const WithButtonAndTimeout = InteractionTemplate.bind({})
WithButtonAndTimeout.args = {
  // 이 스토리에서는 isLoading prop을 직접 제어하지 않습니다.
  position: 'center',
  size: 'm',
  text: '데이터를 처리하고 있습니다...',
  backgroundColor: 'gray',
}

