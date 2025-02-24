<template>
  <div class="question_list min-h-[600px]">
    <div class="header">
      <div class="header-content">常见问题</div>
    </div>
    <div class="list pb-10">
      <a-tabs>
        <a-tab-pane v-for="types in questionList" :key="types.value" :title="types.label">
          <div class="mx-3">
            <a-collapse :default-active-key="[0]" accordion :bordered="false">
              <a-collapse-item v-for="(question, indx) in types.questions" :key="indx" :header="question.title">
                <div class="w-full block" v-html="question.answer"></div>
              </a-collapse-item>
            </a-collapse>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import { FileItem, Message } from '@arco-design/web-vue';
// import postApi, { PostColumnParams } from '@/api/modules/post';
// import useLoading from '@/hooks/loading';
// import { Pagination } from '@/utils/global';

const questionList = [
  // {
  //   label: '创作权益与奖励',
  //   value: 'level',
  //   questions: [
  //     //       {
  //     //         title: '什么样的内容可以被加精？加精后有什么好处？',
  //     //         answer: `
  //     //         1. 内容形式：对他人有启发性且必须原创或者本人翻译的帖子。
  //     //         2. 排版要求：行文排版优雅。
  //     //         3. 题材要求：原则上不限制具体题材，但是帖子要符合与开发相关的技术细节、技巧干货、开源工具介绍、实践总结、行业见解、职业选择等方向；当然也可以是优秀的翻译帖子，这方面可以参考前掘金官方在运营的［掘金翻译计划］。
  //     //         4. 符合标准的引流规范：掘金作为一个帮助开发者成长的技术社区，我们原则上不支持这一行为，但是本着服务用户的原则我们也不禁止这一行为。为了帮助用户拥有更好的阅读体验，我们现对张贴公众号行为作出以下规范：可以是文字引导用户关注公众号，但是对于添加个人微信账号、引导用户进群、推广产品等威胁用户信息安全的行为一律禁止。
  //     //         关于评判优质内容的更多详情，请查看：
  //     //         https://juejin.cn/book/6844733795329900551/section/6844733795380232199
  //     // 。`,
  //     //       },
  //   ],
  // },
  {
    label: '内容加精、推荐与曝光',
    value: 'like',
    questions: [
      {
        title: '什么样的内容可以被加精？',
        answer: `
        内容形式：<br>
        1. 优秀的同人图贴<br>
        2. 鞭辟入里且得到大家广泛认可的游戏评论<br>
        3. 详细且丰富的游戏攻略贴及游戏运行教程<br>
        4. 自己设计并制作的关于游戏相关的物品图贴<br>
        5. 玩家开发的游戏辅助工具<br>
        6. 轩辕剑系列及其相关的一些游戏资源共享（共享前需征得官方同意）<br>
        排版要求：行文排版优雅。<br>`,
      },
      {
        title: '加精后有什么好处？',
        answer: `1. 当前平台内容较少，暂未启用推荐算法。平台内容足够丰富后，会启用推荐算法。
        2. 加精的内容将会作为推荐算法的重要影响因素，影响内容在APP、网页端的内容推荐、APP消息推送的曝光和排序。
        3. 每年年终结算时，会对创作数据进行全面评估`,
      },
    ],
  },
  {
    label: '内容审核相关',
    value: 'process',
    questions: [
      {
        title: '为什么发布内容需要审核？',
        answer: `为什么会有安全审核？<br>
        1. 根据中华人民共和国及港澳台相关法律法规规定，保障平台内容安全：过滤露骨的涉黄、涉暴、涉毒、赌博、反动、引战等安全底线问题。<br>
        2. 保障用户体验，有助于提升平台讨论环境质量：打击低俗、辱骂、广告等低质内容。`,
      },
      {
        title: '什么样的内容需要审核？',
        answer: `按照相关法律法规要求，用户在平台发布和传播的内容均需要审核，包括但不限于：<br>
        1. 资料：用户头像昵称、职位、个人介绍等......<br>
        2.所有需要发布的内容：帖子、同人作品、尺牍、图片、评论、专栏等内容`,
      },
      {
        title: '有几种审核状态？',
        answer: `1. 审核中：内容发布后将进入审核状态，在创作者中心中，有标签会提示内容正在审核中。<br>
        2. 审核不通过：内容审核不通过，会有相关消息提醒，请参考消息中的反馈结果以及<a href="" class="text-blue-500 hover:text-blue-700 hover:font-bold" target="_blank">社区规范</a>进行内容调整，内容修改并提交后，会再次进入“审核中”状态。<br>
        3. 审核通过：审核通过后的帖子会发布成功并出现在首页列表里。<br>
        4. 内容被下架：如果你发布后的内容不符合相关法律法规要求，会直接下架处理，同时会有系统消息发送给你。`,
      },
      {
        title: '我自查后仍无法确认问题所在，如何进行申诉？',
        answer: `申诉渠道：审核未通过的内容，如果经过自查后，仍无法确认问题所在，请通过以下渠道任选其一进行反馈：<br>
        1. 通过申诉通道<a></a>提交你的问题和帖子链接，天书书吏将在排查后反馈相关问题。<br>
        2. 通过社区讨论群，咨询管理员确认问题所在。`,
      },
      // {
      //   title: '内容审核问题',
      //   answer: `申诉渠道：审核未通过的内容，如果经过自查后，仍无法确认问题所在，请通过以下渠道任选其一进行反馈：<br>
      //   1. 通过申诉通道<a></a>提交你的问题和帖子链接，天书书吏将在排查后反馈相关问题。<br>
      //   2. 通过社区讨论群，咨询管理员确认问题所在。`,
      // },
    ],
  },
];

onMounted(() => {});
</script>

<style lang="scss" scoped>
.question_list {
  @apply bg-white w-full rounded-sm;

  .header {
    @apply h-14 leading-[3.5rem] px-5 text-base font-bold border-b-gray-100 border-b flex flex-row justify-between items-center;
  }
}
.demo-basic {
  // padding: 10px;
  width: 80px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
