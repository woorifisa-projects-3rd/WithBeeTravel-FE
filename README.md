![image](https://github.com/user-attachments/assets/7828a218-57ef-4feb-9d11-d791e3d30df5)

<br/>

## ✈ 프로젝트 소개
> 해당 프로젝트는 우리FISA에서 진행한 최종 프로젝트이며,<br/>
뱅킹 기반 서비스(슈퍼앱)를 통한 생활밀착형 서비스 플랫폼을 주제로 개발하였습니다. <br/>

**WithBee Travel**은 여행 공동 지출 관리 및 자동 정산 서비스입니다. <br/>
단체 정산을 자동화하여 그룹 구성원들이 보다 쉽게 비용을 공유하고 정산할 수 있도록 도와줍니다. <br/>

<br/>

- 프로젝트 기간: 2024.10.21 ~ 2024.12.11
- 배포 기간: 2024.11.11 ~ 2024.12.12

<br/>

## 👨‍🏫 기획 배경
총무에게 집중되는 부담을 줄이거나 뒤섞인 결제 내역을 편리하게 관리해줌으로써 <br/>
여행 중 발생하는 지출을 보다 효율적으로 관리해주기 위해 해당 서비스를 기획했습니다.

단체 여행에서 발생하는 결제와 정산은 다음과 같은 이유들로 부담스럽고 복잡하게 느껴집니다.

**💼 총무의 부담**: 한 사람이 모든 결제를 맡아 책임이 집중되는 경우, 큰 금액을 관리해야 한다는 부담으로 여행을 온전히 즐기기 어렵습니다. <br/><br/>
**🗃 복잡한 정산 과정**: 결제 내역 별로 사용한 인원이 다를 경우, 정리하고 정산하는 과정이 복잡하여 피로도가 증가합니다. <br/><br/>
**⚖ 애매한 환율 기준**: 해외 여행의 경우, 결제 시점과 정산 시점의 환율 차이로 인해 정산 금액을 정하는 기준을 잡기 어렵습니다.

이러한 문제를 해결하기 위해, 누구나 간편하게 결제 내역을 기록하고 실시간으로 자동 정산할 수 있는 시스템을 기획했습니다! <br/>
사용자는 더 이상 결제와 정산에 신경 쓰지 않고, 여행에만 집중할 수 있는 환경을 제공하는 것이 이 서비스의 핵심 목표입니다. 🌟 <br/>
<br/>

## ⭐ 프로젝트 주요 기능
### 1. 코어 뱅킹
> 서비스 기능에 적합한 금융 코어 기능을 구현하였습니다.
<table>
  <tr>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EB%B1%85%ED%82%B9%ED%99%88.gif" alt="뱅킹 홈" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EA%B3%84%EC%A2%8C%EC%83%9D%EC%84%B1.gif" alt="계좌 생성" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EA%B3%84%EC%A2%8C%EC%83%81%EC%84%B8.gif" alt="계좌 상세" width="200"/></td>
  </tr>
  <tr>
    <td align="center">뱅킹 홈</td>
    <td align="center">계좌 생성</td>
    <td align="center">계좌 상세</td>
  </tr>
</table>
<table>
  <tr>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%9E%85%EA%B8%88%ED%95%98%EA%B8%B0.gif" alt="입금" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%86%A1%EA%B8%88%ED%95%98%EA%B8%B0.gif" alt="송금" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%B9%B4%EB%93%9C%EA%B2%B0%EC%A0%9C%EB%82%B4%EC%97%AD%EC%95%8C%EB%A6%BC.gif" alt="카드 결제 내역 알림" width="200"/></td>
  </tr>
  <tr>
    <td align="center">입금</td>
    <td align="center">송금</td>
    <td align="center">카드 결제 내역 알림</td>
  </tr>
</table>

<br/>

### 2. 여행 생성 및 가입
> 결제 내역을 공유하고 정산할 수 있는 그룹인 여행을 생성하거나 초대 코드를 통해 가입할 수 있는 기능을 구현했습니다.
<table>
  <tr>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%97%AC%ED%96%89%EC%83%9D%EC%84%B1.gif" alt="여행 생성" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%B4%88%EB%8C%80%EC%BD%94%EB%93%9C%EA%B3%B5%EC%9C%A0%ED%95%98%EA%B8%B0.gif" alt="초대 코드 공유" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EC%B4%88%EB%8C%80%EC%BD%94%EB%93%9C%EB%A1%9C%EA%B0%80%EC%9E%85%ED%95%98%EA%B8%B0.gif" alt="초대 코드로 가입" width="200"/></td>
  </tr>
  <tr>
    <td align="center">여행 생성</td>
    <td align="center">초대 코드 공유</td>
    <td align="center">초대 코드로 가입</td>
  </tr>
</table>

<br/>

### 3. 그룹 공동 결제 내역 확인
> 결제 멤버와 결제 참여 멤버를 한 눈에 볼 수 있도록 구현했습니다. <br/>
원하는 결제 내역만 확인할 수 있는 필터링 기능을 제공합니다. <br />
결제 참여 멤버를 손쉽게 변경할 수 있습니다.

<table>
  <tr>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EA%B3%B5%EB%8F%99%EA%B2%B0%EC%A0%9C%EB%82%B4%EC%97%AD.gif" alt="그룹 공동 결제 내역 확인" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EA%B3%B5%EB%8F%99%EA%B2%B0%EC%A0%9C%EB%82%B4%EC%97%AD%ED%95%84%ED%84%B0%EB%A7%81.gif" alt="결제 내역 필터링" width="200"/></td>
    <td><img src="https://github.com/woorifisa-projects-3rd/WithBeeTravel-FE/blob/ysa-readme/assets/%EA%B3%B5%EB%8F%99%EA%B2%B0%EC%A0%9C%EB%82%B4%EC%97%AD%EC%B0%B8%EC%97%AC%EC%9D%B8%EC%9B%90%EC%88%98%EB%B3%80%EA%B2%BD.gif" alt="정산 참여 멤버 선택" width="200"/></td>
  </tr>
  <tr>
    <td align="center">그룹 공동 결제 내역 확인</td>
    <td align="center">결제 내역 필터링</td>
    <td align="center">정산 참여 멤버 선택</td>
  </tr>
</table>

## ![주요 기능](https://github.com/user-attachments/assets/2979f638-cd8c-4fbf-bb0d-f41feb34b909)

<br/>

## 🎥 시연 영상

[윗비트래블 시연 영상](https://youtu.be/MLBJV3tiibA)

<br/>


## 📚 기술 스택

## ![기술 스택1](https://github.com/user-attachments/assets/35065822-dd35-4abb-8fb8-4eef7c08963d)
## ![기술 스택2](https://github.com/user-attachments/assets/990bad5a-d693-446e-963e-f00f6ef78c9a)

<br />

## 🗃️ 인프라 구조도

## ![인프라 구조도](https://github.com/user-attachments/assets/49bd6e51-3569-4d2d-9a0c-7d965a176e03)

<br/>

## 🎈 Commit 방법

### Commit Title

`[{type}/{jira_issue_num}]: Update [README.md](http://README.md)` 

- Type: `{type}`
- Jira Issue Num: `{jira_issue_num}`
- Subject: `Update README.m`

### Type

- [feat] : 새로운 기능 추가
- [fix] : 버그 수정
- [docs] : 문서 수정
- [style] : 코드 포맷 변경, 세미콜론 누락, 코드 변경 없음
- [refactor] : 프로덕션 코드 리팩터링
- [test] : 테스트 추가, 테스트 코드 리팩터링, 프로덕션 코드 변경 없음
- [build] : gradle 세팅, 패키지 추가
- [chore] : 빌드 테스크 업데이트, 패키지 매니저 환경설정, 프로덕션 코드 변경 없음

### Subject

- Subject만 보고도 해당 작업을 판단할 수 있게 작성해준다.
- ex) 클라이언트에서 토큰 받아오는 기능 추가
- 길이는 50자 이하로 작성한다.
- 끝에는 마침표를 붙이지 않는다.

### Jira Issue Num

- 지라에서 자동적으로 정해주는 issue 번호를 사용한다.

## 👻 팀원구성

| <img src="https://github.com/Kong-E.png" width="200" /> | <img src="https://github.com/yaejinkong.png" width="200" /> | <img src="https://github.com/HoChoRoo.png" width="200" /> |
| :------------------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------: |
|           [공소연](https://github.com/Kong-E)           |           [공예진](https://github.com/yaejinkong)           |           [김호철(팀장)](https://github.com/HoChoRoo)           |
|                           풀스택                           |                       풀스택                        |                        풀스택                         |
|        공동 지출 내역, 생성형 AI      |        결제 내역 정산, SSE 실시간 알림        |        코어 뱅킹, 인프라        |

| <img src="https://github.com/SeungAh-Yoo99.png" width="200" /> | <img src="https://github.com/doyi0107.png" width="200" /> | 
| :-------------------------------------------------------: | :--------------------------------------------------------: | 
|        [유승아](https://github.com/SeungAh-Yoo99)        |           [이도이](https://github.com/doyi0107)           |      
|                          풀스택                           |                           풀스택                           |     
|        결제 내역 추가, 허니 캡슐 관리         |         여행 관리, SSE 실시간 알림          |  

<br/>
