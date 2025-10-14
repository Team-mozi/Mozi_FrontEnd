import { useState } from 'react'
import SideSheet from '@/components/SideSheet'
import BottomSheet from '@/components/BottomSheet'
import Button from '@/components/Button'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import LogoutModal from '@/features/modal/LogoutModal'
import WithdrawalModal from '@/features/modal/WithdrawalModal'
import useMobile from '@/hooks/useMobile'
import Logo from '@/components/Logo'

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
  const { nickname, email } = useSelector((state: RootState) => state.auth)

  const isMobile = useMobile() // 현재 화면이 모바일인지 확인

  // 공통 콘텐츠 (SideSheet / BottomSheet 둘 다에서 사용)
  const sheetContent = (
    <>
      {isMobile ? (
        <BottomSheet.Content>
          <Logo size='s'></Logo>
          <p className='text-lg pb-1'>{nickname} 님</p>
          <p className='text-lg'>{email}</p>
        </BottomSheet.Content>
      ) : (
        <SideSheet.Content>
          <div className='px-10'>
            <Logo size='l'></Logo>
            <p className='text-xl pb-2'>{nickname} 님</p>
            <p className='text-xl'>{email}</p>
          </div>
        </SideSheet.Content>
      )}
      {/* 푸터 버튼 */}
      {isMobile ? (
        <BottomSheet.Footer>
          <div className='space-y-4'>
            <Button
              label='로그아웃'
              baseButton
              onClick={() => setIsLogoutModalOpen(true)}
            />
            <Button
              label='회원탈퇴'
              onClick={() => setIsWithdrawalModalOpen(true)}
            />
          </div>
        </BottomSheet.Footer>
      ) : (
        <SideSheet.Footer>
          <div className='p-10 space-y-6'>
            <Button
              label='로그아웃'
              baseButton
              onClick={() => setIsLogoutModalOpen(true)}
            />
            <Button
              label='회원탈퇴'
              onClick={() => setIsWithdrawalModalOpen(true)}
            />
          </div>
        </SideSheet.Footer>
      )}
    </>
  )

  return (
    <div>
      {/* 추후 홈에서 마이페이지 버튼 추가하면 삭제 예정 */}
      <Button
        label='마이페이지'
        onClick={() => setIsOpen(true)}
        baseButton
        size='s'
      />

      {/* 반응형: 화면 크기에 따라 SideSheet / BottomSheet 전환 */}
      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {sheetContent}
        </BottomSheet>
      ) : (
        <SideSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {sheetContent}
        </SideSheet>
      )}

      {/* 로그아웃 모달 */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      {/* 회원탈퇴 모달 */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </div>
  )
}

export default MyPage
