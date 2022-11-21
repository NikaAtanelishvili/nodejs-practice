const deleteProduct = async btn => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value

  const productEl = btn.closest('article')

  const result = await fetch(`/admin/product/${prodId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })

  await productEl.remove()

  console.log(result)
}
