import {configure, render} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import {LanguageType} from 'shared/schema/Constants';
import {FEATURED_QUESTS} from '../../Constants';
import {QuestDetails} from '../../reducers/QuestTypes';
import {SearchSettings} from '../../reducers/StateTypes';
import {
  renderResult,
  SearchResultProps,
} from './Search';
configure({ adapter: new Adapter() });

const TEST_SEARCH: SearchSettings = {
  age: 31536000,
  contentrating: 'Teen',
  genre: 'Comedy',
  language: 'English' as LanguageType,
  maxtimeminutes: 60,
  mintimeminutes: 30,
  order: '+title',
  text: 'Test Text',
};

describe('Search', () => {
  describe('Settings', () => {
    /*
    function setup() {
      const props: SearchSettingsCardProps = {
        user: loggedOutUser,
        settings: initialSettings,
        search: initialSearch.search,
        onSearch: jasmine.createSpy('onSearch'),
      };
      const wrapper = shallow(<SearchSettingsCard {...props} />);
      return {props, wrapper};
    }

    it('propagates user selections when Search is pressed', () => {
      const {props, wrapper} = setup();
      const inst = wrapper.instance();
      expect(inst.state).toEqual(initialSearch.search);
      for (const k of Object.keys(TEST_SEARCH)) {
        wrapper.find('#'+k)
          .simulate('change', { target: { value: TEST_SEARCH[k] } }, TEST_SEARCH[k], TEST_SEARCH[k]);
      }

      wrapper.find('#search').simulate('click');
      expect(props.onSearch).toHaveBeenCalledWith(TEST_SEARCH, jasmine.any(Object));
    });
    */
  });

  describe('Result', () => {
    function setup(questTitle: string, overrides?: Partial<SearchResultProps>, questOverrides?: Partial<QuestDetails>) {
      const props: SearchResultProps = {
        index: 0,
        lastPlayed: null,
        offlineQuests: {},
        onQuest: jasmine.createSpy('onQuest'),
        quest: {...FEATURED_QUESTS.filter((el) => el.title === questTitle)[0], ...questOverrides},
        search: TEST_SEARCH,
        ...overrides,
      };
      const wrapper = render(renderResult(props), undefined /*renderOptions*/);
      return {props, wrapper};
    }

    it('displays no expansion icons when quest has no expansions', () => {
      const {wrapper} = setup('Learning to Adventure');
      expect(wrapper.html()).not.toContain('horror');
    });

    it('displays offline icon when quest is available offline');

    it('displays horror icon when a quest uses the Horror expansion', () => {
      const {wrapper} = setup('Learning 2: The Horror');
      expect(wrapper.html()).toContain('horror');
    });

    it('displays no book icon when a quest does not require pen and paper', () => {
      const {wrapper} = setup('Learning to Adventure', {}, {requirespenpaper: false});
      expect(wrapper.html()).not.toContain('book');
    });

    it('does not display last played date if quest has not been played', () => {
      const {wrapper} = setup('Learning to Adventure');
      expect(wrapper.html()).not.toContain('questPlayedIcon');
    });

    it('displayed last played date if quest has been played before', () => {
      const {wrapper} = setup('Learning to Adventure', {lastPlayed: new Date()});
      expect(wrapper.html()).toContain('questPlayedIcon');
    });

    it('does not display awarded icon when quest not awarded', () => {
      const {wrapper} = setup('Learning to Adventure');
      expect(wrapper.html()).not.toContain('questAwardedIcon');
    });

    it('displays awarded icon if quest has received award', () => {
      const {wrapper} = setup('Learning to Adventure', {}, {awarded: 'The Bob Medal For Questing Mediocrity'});
      expect(wrapper.html()).toContain('questAwardedIcon');
    });

    it('does not display official icon if quest is not official', () => {
      const {wrapper} = setup('Learning to Adventure', {}, {official: false});
      expect(wrapper.html()).not.toContain('questOfficialIcon');
    });

    it('displays official icon if quest is official', () => {
      const {wrapper} = setup('Learning to Adventure');
      expect(wrapper.html()).toContain('questOfficialIcon');
    });
  });

  describe('Results', () => {
    it('gracefully handles no search results');
    it('renders some search results');
  });
});
