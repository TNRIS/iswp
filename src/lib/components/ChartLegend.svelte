<script>
    let propTypes = {
        entries: PropTypes.arrayOf(
            PropTypes.shape({
                className: PropTypes.string.isRequired,
                display: PropTypes.string.isRequired,
            })
        ).isRequired,
        rectangle: PropTypes.bool,
        className: PropTypes.string,
    };
</script>
