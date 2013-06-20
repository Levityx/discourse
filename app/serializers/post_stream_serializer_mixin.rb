module PostStreamSerializerMixin

  def self.included(klass)
    klass.attributes :post_stream
  end

  def post_stream
    result = { posts: posts,
               stream: object.filtered_post_ids,
               highest_post_number: object.highest_post_number }

    result[:last_read_post_number] = object.topic_user.last_read_post_number if object.topic_user.present?
    result
  end

  def posts
    return @posts if @posts.present?
    @posts = []
    @highest_number_in_posts = 0
    if object.posts.present?
      object.posts.each_with_index do |p, idx|
        if p.user
          @highest_number_in_posts = p.post_number if p.post_number > @highest_number_in_posts
          ps = PostSerializer.new(p, scope: scope, root: false)
          ps.topic_slug = object.topic.slug
          ps.topic_view = object
          p.topic = object.topic

          @posts << ps.as_json
        end
      end
    end
    @posts
  end

end
