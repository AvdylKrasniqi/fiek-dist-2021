<template>
    <div class="flex gap-2 p-1 odd:bg-gray-200">
        <avatar :name="message.sender"></avatar>
        <div>
            <p class="font-bold">{{message.sender}}</p>
            <p class="whitespace-preline">{{ message.msg }}</p>
        </div>
    </div>
</template>
<script>
import Avatar from "./Avatar.vue";

export default {
    props: {
        message: Object,
    },
    components: {
        Avatar,
    }
}
</script>