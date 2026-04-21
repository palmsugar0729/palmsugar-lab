<template>
    <div class="flip_card">
        <div class="content">
            <div class="front">front</div>
            <div class="back">back!</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    
    .flip_card {
        width: 500px;
        height: 500px;
        perspective: 800px;
        cursor: pointer;
        background-color: aqua;

        .content {
            width: 300px;
            height: 200px;
            transition: transform 0.6s ease;
            transform-style: preserve-3d;
        }
    }
    
    .card:hover .content {
        transform: rotateY(180deg);
        transition: transform 0.5s;
    }

    .front, .back {
        display: flex;
        height: 100%;
        width: 100%;
        background: white;
        line-height: 300px;
        color: #03446a;
        align-items: center;
        justify-content: center;
        font-size: 60px;
        border-radius: 5px;
        backface-visibility: hidden;
    }

    .back {
        background: #03446a;
        color: white;
        transform: rotateY(180deg);

    }
</style>