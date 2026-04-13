export interface TeamItem {
  id: string;
  label: string;
}

export interface AppSidebarProps {
  /** 현재 선택된 팀 ID (라우트/상태와 연동용) */
  selectedTeamId?: string | null;
  /** 팀 선택 시 콜백 */
  onTeamSelect?: (teamId: string) => void;
  /** 팀 추가하기 클릭 시 콜백 */
  onAddTeam?: () => void;
  /** 하단 프로필 영역. 미전달 시 기본 프로필 블록 표시 */
  footer?: React.ReactNode;
  teams?: TeamItem[];
  /** 로그인 여부. false면 하단에 로그인 유도 UI 표시 (기본 프로필 사용 시만 적용) */
  isLoggedIn?: boolean;
  /** 모바일 드로어 모드. true면 항상 펼침, 헤더에 닫기(X)만 표시 */
  mobileDrawer?: boolean;
  /** 모바일 드로어 닫기 콜백 (mobileDrawer일 때만 사용) */
  onClose?: () => void;
  /** 로그인 버튼 클릭 시 콜백 (로그아웃 상태에서만 사용) */
  onLoginClick?: () => void;
}
