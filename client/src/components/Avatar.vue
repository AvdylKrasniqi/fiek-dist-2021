<template>
    <div class="bg-blue-900 text-white p-5 rounded-full w-16 h-16 text-center">{{ initials }}</div>
</template>
<script>

export default {
    props: {
        name: String
    },
    computed: {
        initials: function(){
            return this.name.split(" ").filter((val,index )=>{ return index < 2}).map(val => val[0]).join("").toUpperCase()
        }
    }
}
</script>
