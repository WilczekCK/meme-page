<template lang="pug">
.profile__page
  .profile__container
    .profile__container__header(v-if="isPageLoaded")
        .profile__container__header--cover()
        .profile__container__header--avatar
          img(:src="checkAvatar(user.fb_id)")
          .profile__container__header--avatar--config(v-if="user.fb_id === $store.state.isLogged.id || $store.state.isLogged.role === 1" @click="$store.commit('modalToggle', 'avatar')")
            i(class="fas fa-wrench")
            addAvatarModal

        .profile__container__header--nickname {{user.username}}
          .profile__container__header--nickname--config(v-if="user.fb_id === $store.state.isLogged.id || $store.state.isLogged.role === 1" @click="$store.commit('modalToggle', 'nickname')")
            i(class="fas fa-wrench")
            addAvatarModal
        .profile__container__header--role
          p(v-if="user.role === 1")
            ="Administrator"
          p(v-else-if="user.role === -1")
            ="Banned"
          p(v-else)
            ="User"
        .profile__container__header--joinedDate
            p="Joined: {{moment(user.registered)}}"
    .profile__container__content(v-if="isPageLoaded")
        .profile__container__content__stats
            .profile__container__content__stats--uploadedMemes
                ="Uploaded memes: {{user.memes_count}}"
            .profile__container__content__stats--ppSum
                ="Total reach likes: {{user.sum_likes}}"
  .profile__memes__container
    .meme__container
      memeItem(v-for="post in userMemes" :memeDetails="post" :key="post.id")
      no-ssr
        infinite-loading(@infinite="infiniteScroll")
</template>

<script>
import addAvatarModal from '~/layouts/components/modals/modal'
import memeItem from '~/layouts/components/mixins/meme-item.vue'
export default {
  name: 'id',
  components:{
    addAvatarModal,
    memeItem
  },
  data: function() {
    return{
      avatarName: undefined,
      user: null,
      isPageLoaded: false,
      userMemes: [],
      page: 1,
    }
  },
  async mounted() {
    await this.$axios
      .get(`/api/users/${this.$route.params.id}`)
      .then(async ({data}) => {
          this.user = data.data;
      })
      .catch(() => {
          this.$nuxt.error({ statusCode: 404, message: 'No user found!'})
      })

    await this.$axios
      .get(`/api/meme/user/${this.$route.params.id}`)
      .then( ( {data} ) => {
        let userMemes = data.data;
        if(userMemes.length){
          userMemes.forEach((meme) => { this.userMemes.push(meme) })
        }
      })

    this.avatarName = this.user.fb_id;
    this.isPageLoaded = true;
  },
  methods:{
    checkAvatar: function(id){
      try{
        return require(`~/assets/img/avatars/${id}.jpg`);
      }catch(err){
        return require(`~/assets/img/avatars/default.jpg`);
      }
    },
    moment: function(date){
      const today = this.$moment();
      const incomingDate = this.$moment(date);
      return incomingDate.from(today);
    },
     infiniteScroll($state){
      this.$axios({
        url:'/api/meme/load/user',
        method:'GET',
        headers:{
          "page": this.page,
          "loadElements":5,
          "userid": this.$route.params.id
        }
      })
      .then( ( {data} ) => {
        if(data.data.length){
          this.page += 1;

          let memes = data.data;
          memes.forEach((meme) => { 
            this.userMemes.push(meme) 
          })
          $state.loaded();
        }else{
          $state.complete()
        }
      })
    }
  },
  head () {
    return {

    }
  }
}
</script>

 
