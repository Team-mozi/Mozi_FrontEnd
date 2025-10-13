import BottomSheet from '@/components/BottomSheet'
import type { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

export default {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '바텀시트 열림/닫힘 상태',
    },
    overlayClassName: {
      control: 'text',
      description: '배경 오버레이 CSS 클래스',
    },
    disableOverlayClose: {
      control: 'boolean',
      description: '오버레이 클릭 시 바텀시트 닫기 비활성화 여부',
    },
  },
} as Meta<typeof BottomSheet>

const Template: StoryFn<typeof BottomSheet> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false)

  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <button
        className='px-4 py-2 bg-blue-500 text-white rounded-md'
        onClick={() => setIsOpen(true)}
      >
        BottomSheet
      </button>

      <BottomSheet {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BottomSheet.Header>
          <h2 className='text-lg font-semibold'>BottomSheet Header</h2>
        </BottomSheet.Header>

        <BottomSheet.Content>
          <p className='mb-2'>바텀시트 콘텐츠 영역입니다.</p>
          <p> 여기에 내용을 넣으시면 됩니다 </p>
        </BottomSheet.Content>
      </BottomSheet>
    </div>
  )
}

/**
 * 기본(Default) 스토리
 * - 버튼 클릭으로 바텀시트를 열고 닫을 수 있습니다.
 */
export const Default = Template.bind({})
Default.args = {
  isOpen: false,
  overlayClassName: 'bg-black/50',
  disableOverlayClose: false,
}
