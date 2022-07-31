<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" aria-label="close" @click="$emit('closeModal')"></button>
      </header>
      <section class="modal-card-body">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus non nisi hic
        accusamus assumenda in itaque recusandae minus voluptatibus nam, incidunt
        consequuntur dolorum pariatur cum nulla iure illo. Enim, et? Cupiditate debitis
        qui iusto ratione nesciunt ducimus quaerat quam! Assumenda esse omnis repudiandae
        tempora voluptates fugit sequi ad. In hic laboriosam veniam. Officiis consectetur
        quaerat aperiam sequi cum vitae pariatur! Modi, mollitia aliquam distinctio
        aspernatur laborum nostrum, explicabo quae eum deserunt maxime architecto illum
        debitis hic assumenda? Aperiam alias aut itaque? Eos dolorum maiores saepe
        temporibus dolore alias debitis beatae? Similique aperiam iure sint non, sunt
        praesentium, dicta labore ducimus voluptate saepe, iste sed? Voluptatem sunt
        veniam minima asperiores? Ipsa reiciendis maiores mollitia velit temporibus
        aliquid in non sint ducimus? Maxime minima et laborum repudiandae aliquid deserunt
        esse, non sint illum animi unde, placeat iste repellendus officia ipsum tempora
        hic saepe. Itaque qui quam veniam eum! Ad porro nobis enim? Cumque eos harum
        impedit, quisquam quidem iure nisi. Expedita rerum fugiat saepe iste placeat?
        Dignissimos tempore eos dicta odio dolorum eum molestias iusto aperiam asperiores
        rem aliquid, error quasi recusandae. Velit voluptatum minus facilis repudiandae
        eos laudantium ipsum, ea consequuntur ipsam voluptas necessitatibus id odio neque
        magnam ratione fuga quibusdam inventore aspernatur quisquam expedita ut
        praesentium? Culpa eveniet quidem incidunt? Doloremque illo iste consequatur
        deserunt quis. Molestiae alias totam nesciunt explicabo dolores cum repellendus
        possimus corporis quis numquam. Eius, temporibus unde quaerat reiciendis dicta quo
        tempora similique error maiores quis? Quos exercitationem eum suscipit itaque
        quasi illum earum rerum soluta libero dolorem maiores quibusdam commodi autem
        quia, saepe delectus molestiae, nihil nam quisquam a laborum, deserunt ut est
        modi? Fugit! Aut deleniti dolorem quaerat! Odit atque assumenda aperiam eos! Earum
        eum doloremque, vitae, suscipit debitis aliquid numquam voluptatibus quos ducimus
        explicabo quaerat id illum temporibus quod nemo quibusdam. Distinctio, ab. Odio
        accusantium delectus nemo quo molestias temporibus! Veniam dolore laboriosam
        maxime, numquam, distinctio quam libero sapiente voluptas necessitatibus qui
        omnis, delectus nemo modi ad facilis error aliquam ipsum natus magni? Quidem,
        nihil, non quaerat iusto assumenda nostrum fugit fuga illum cumque sequi quisquam
        quos nesciunt dolorum itaque amet tempora optio quia beatae perferendis ut?
        Excepturi ipsam qui repellendus quos ea? Nemo veritatis accusantium ex quibusdam
        itaque voluptatem atque a dolorem corrupti, pariatur autem fugiat maxime dicta.
        Amet, at! Ipsum culpa quae aspernatur magni delectus quisquam placeat? Natus esse
        reprehenderit aperiam? Ipsa earum ratione maxime quibusdam at, sequi voluptate
        accusamus explicabo quaerat dolorum atque. Unde, doloribus quam dolores corporis
        consequatur enim. Voluptas quas inventore maiores qui tempora consectetur
        corporis, vitae iste! Quasi est magnam neque nostrum optio fugiat amet, impedit
        obcaecati nobis ipsa recusandae qui voluptatibus sed adipisci in minima temporibus
        eos autem illum natus, a deleniti culpa quas vel? Amet? Ipsam, quaerat odit saepe
        exercitationem voluptates inventore. A, ea architecto! Consectetur tempore omnis
        iure quam earum, cumque dignissimos illo nemo vel, nihil aperiam ipsam voluptates
        officiis qui praesentium, reiciendis nisi? Temporibus, magnam similique! Adipisci
        veritatis obcaecati minus rerum dolorem aliquam assumenda, numquam debitis
        dolores, ea culpa cumque consectetur ullam, blanditiis cupiditate facilis hic.
        Cumque consequuntur quo nesciunt quod fugit culpa? Perferendis accusamus quasi
        quos, voluptatum laborum necessitatibus vel voluptatibus dicta, quod et sint illo
        fugit placeat explicabo quas officia quo asperiores odit, dolorem officiis tempore
        hic! Laboriosam natus quo quam. Ex quae consectetur excepturi reiciendis qui
        aspernatur dicta mollitia aperiam maiores deserunt cumque, placeat repellendus
        cupiditate atque quam obcaecati fugiat ducimus nostrum. Illo culpa quaerat
        explicabo iusto et, obcaecati porro. Architecto nihil cum enim debitis magnam
        possimus deserunt rem nam iste necessitatibus mollitia reprehenderit obcaecati
        perferendis quidem dicta, totam iure. Quis adipisci deleniti autem corrupti itaque
        necessitatibus perferendis quia sit.
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modalTitle: {
      type: String,
      required: true
    },
    modalInfo: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
.modal {
  display: flex;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  border-top-right-radius: 10px;
  transform: translate(-50%, -50%);
  height: 70vh;
}

.modal-card-head {
  background-color: #2c3e50;
}

.modal-card-head .modal-card-title {
  color: rgb(200, 200, 200);
}

.modal-card-body {
  color: #02203c;
  overflow-y: scroll;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 1.5rem;
  text-align: justify;
}
</style>
