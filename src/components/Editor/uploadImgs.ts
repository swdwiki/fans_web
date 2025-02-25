import { IButtonMenu, IDomEditor, Boot } from '@wangeditor-next/editor';

class UpLoadImagesButton implements IButtonMenu {
  id = `btn-${Math.random().toString(36).slice(2)}`;

  title: string;

  tag: string;

  iconSvg: string;

  // TS 语法
  // class MyButtonMenu {                       // JS 语法

  constructor() {
    this.title = '图片上传'; // 自定义菜单标题
    this.iconSvg =
      '<svg t="1740401737502" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2076" width="20" height="20"><path d="M853.344 341.344C853.344 294.4 814.944 256 768 256s-85.344 38.4-85.344 85.344 38.4 85.344 85.344 85.344 85.344-38.4 85.344-85.344z" p-id="2077"></path><path d="M0 85.344v853.344h512v-85.344H85.344V742.4l256-256L512 657.056l59.744-59.744-230.4-230.4-256 256V170.656h853.344v298.656l85.344 85.344V85.312z" p-id="2078"></path><path d="M951.456 840.544L1011.2 780.8l-200.544-200.544-200.544 200.544 59.744 59.744L768 742.4v238.944h85.344V742.4z" p-id="2079"></path></svg>'; // 可选
    this.tag = 'button';
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {
    // TS 语法
    // getValue(editor) {                              // JS 语法
    return '';
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {
    // TS 语法
    // isActive(editor) {                    // JS 语法
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    // TS 语法
    // isDisabled(editor) {                     // JS 语法
    return false;
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor & any, value: string | boolean) {
    // // TS 语法
    // // exec(editor, value) {                              // JS 语法
    if (this.isDisabled(editor)) return;
    editor?.uploadImageModal();
    // editor.insertText(value); // value 即 this.value(editor) 的返回值
  }
}

const upLoadImagesButtonMenu = {
  key: 'upLoadImagesButton',
  factory() {
    return new UpLoadImagesButton();
  },
};

Boot.registerMenu(upLoadImagesButtonMenu);
