<template lang="pug">
    .tbm__container
        h4="Today best meme:"
        .tbm__container__content(v-if="isPageLoaded")
            .meme__container(v-if="todayBestMeme")
                memeItem(:memeDetails="todayBestMeme")
            p(v-else)="No best memes for today :("
        p(v-else)="Loading..."
</template>

<script>
import memeItem from '../mixins/meme-item.vue';
export default {
  components: {
      memeItem
  },
  data: function() {
    return{
        isPageLoaded:false,
        todayBestMeme: undefined,
    }
  },
  async mounted() {
    await this.$axios({
        url: '/api/meme/tbm',
        method: 'GET'
    }).then(({data}) => {
        this.todayBestMeme = data.data[0];
        this.isPageLoaded = true;
    })
}
}
</script>
