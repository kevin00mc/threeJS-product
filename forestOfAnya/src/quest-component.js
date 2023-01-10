import {entity} from "./entity.js";


export const quest_component = (() => {

  const _TITLE = 'おめでとう！クエスト達成した!';
  const _TEXT = `アーニャ、みつかっちゃった！でも。。。。`;

  class QuestComponent extends entity.Component {
    constructor() {
      super();

      const e = document.getElementById('quest-ui');
      e.style.visibility = 'hidden';
    }

    InitComponent() {
      this._RegisterHandler('input.picked', (m) => this._OnPicked(m));
    }

    _OnPicked(msg) {
      // HARDCODE A QUEST
      const quest = {
        id: 'foo',
        title: _TITLE,
        text: _TEXT,
      };
      this._AddQuestToJournal(quest);
    }

    _AddQuestToJournal(quest) {
      const ui = this.FindEntity('ui').GetComponent('UIController');
      ui.AddQuest(quest);
    }
  };

  return {
      QuestComponent: QuestComponent,
  };
})();