<template>
  <div class="welcome-header__container" :style="{ backgroundImage: 'url(' + seller.header_image + ')' }">
    <div class="welcome-header__gradient"></div>
    <div class="gr">
      <div class="welcome-header">
        <div class="profile-photo">
          <img :src="seller.profile_image"/>
          <div v-if="isEditingProfile"
               class="profile-photo-edit-button-overlay"
               @click.prevent="$refs.profilePhotoFileInput.click()">
            <div class="profile-photo-edit-button-overlay-top">
              <i class="icon--camera"></i>
            </div>
            <div class="profile-photo-edit-button-overlay-bottom">
              Upload new photo
            </div>
          </div>
          <input ref="profilePhotoFileInput"
                 type="file"
                 style="display: none;"
                 @change="profilePhotoFileChange">
        </div>
        <h3 v-if="!isEditingProfile" class="welcome-header__title text-shadow">{{ seller.name }}</h3>
        <input v-if="isEditingProfile" class="seller-name-input" v-model="sellerInputs.name"/>
        <div v-if="!isEditingProfile" class="welcome-header__content seller-info text-shadow">
          {{ seller.profile_info }}
        </div>
        <p v-if="isEditingProfile" style="margin: 0">
          <textarea class="seller-profile-info-input" v-model="sellerInputs.profileInfo"/>
        </p>
        <div class="welcome-header__content seller-community-stats">
          <div v-if="reviewCount > 0"
               class="reviews-average-text"
               @mouseover="mouseOverReviewsAverageText"
               @mouseout="mouseOutReviewsAverageText"
               style="cursor: pointer">
            <div @click.prevent="showReviewList" style="display: flex;">
              <vue-star-rating
                  :increment="0.5"
                  :max-rating="5"
                  :rating="roundedAverageRating"
                  :star-points="[23,2, 16,19, 0,19, 12,32, 7,50, 23,38, 38,50, 34,32, 46,19, 29,19]"
                  inactive-color="#00000000"
                  active-color="#ffda86"
                  border-color="#ffda86"
                  show-rating="false"
                  rounded-corners="true"
                  inline="true"
                  border-width="2"
                  read-only="true"
                  star-size="16"
              />
              <div style="margin-left: 8px; margin-bottom: 2px;" class="text-shadow">
                <b>{{ roundedAverageRating }}</b> Based on {{ reviewCount }} reviews
              </div>
            </div>
            <div v-if="isReviewsTooltipVisible" class="reviews-tooltip-container">
              <div class="reviews-tooltip">
                <div class="reviews-tooltip-arrow-space">
                  <span class="triangle"></span>
                </div>
                <div class="reviews-tooltip-body">
                  <div class="reviews-tooltip-body-inner" @click.prevent="showReviewList">
                    <div style="text-align: left; width: 100%;">
                      <review-stats-summary :seller="seller" />
                    </div>
                    <review-percentages-breakdown :seller="seller" />
                  </div>
                  <div v-if="!is_my_profile && is_authenticated">
                    <hr style="margin: 0"/>
                    <div class="reviews-tooltip-body-write-review-button"
                         @click.prevent="showSubmitReview">
                      <div style="text-align: left; display: inline-block;">
                        <div class="write-review-button" @click.prevent="showSubmitReview">
                          <img class="feedback-icon" src="/assets/images/site/feedback.svg">
                          <template v-if="myReview.productId === null">Write your review</template>
                          <template v-else>Edit your review</template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if=" ! reviewCount > 0" class="reviews-average-text text-shadow">
            <div v-if="is_my_profile">
              No reviews yet
            </div>
            <div v-if=" ! is_my_profile" style="cursor: pointer; font-size: 15px; text-decoration: underline;"
                 @click.prevent="showSubmitReview">
              Add a review
            </div>
          </div>
          <div class="follower-count text-shadow">
                    <span style="text-transform: uppercase;">
                        {{ followerCount }}
                        <span v-if="followerCount === 1">Follower</span>
                        <span v-else>Followers</span>
                    </span>
          </div>
        </div>
        <div class="header-bottom-button-row">
          <div v-if="is_my_profile" class="profile-edit-buttons-container">
            <button v-if="isEditingProfile" class="btn btn--hollow box-shadow"
                    @click.prevent="cancelUpdateSellerProfile">Cancel
            </button>
            <button v-if="isEditingProfile" class="btn btn--white box-shadow"
                    @click.prevent="updateSellerProfile" :disabled="isProfileDisabled">Save Changes
            </button>
            <button v-if="!isEditingProfile" class="btn btn--white box-shadow"
                    @click.prevent="isEditingProfile=true">Edit Profile
            </button>
          </div>
          <div v-if="!is_my_profile">
            <button v-if="amIFollowing" class="btn btn--white following-button box-shadow"
                    @click.prevent="unfollow">
              <i class="icon--tick2"></i> Following
            </button>
            <button v-if="!amIFollowing" class="btn btn--white follow-button box-shadow"
                    @click.prevent="follow">
              <i class="icon--plus"></i> Follow
            </button>
            <button class="btn btn--hollow contact-button box-shadow"
                    @click.prevent="openContactModal">
              <i class="icon--email"></i> Message
            </button>
          </div>
        </div>
      </div>
      <div class="header-bottom-top-row">
        <input ref="headerPhotoFileInput"
               type="file"
               style="display: none;"
               @change="headerPhotoFileChange">
        <div v-if="isEditingProfile"
             class="header-edit-photo-button-container text-shadow"
             @click.prevent="$refs.headerPhotoFileInput.click()">
          <div style="position: relative"><i class="icon--camera"></i></div>
          <div>Change header photo</div>
        </div>
      </div>
    </div>

    <!--
    Modals
    -->
    <ma-modal :active.sync="modals.loginPrompt" container-class="modal-width-medium">
      <template v-slot:body>
          <div class="center">
              <p>To follow {{ seller.name }}, please log in or sign up.</p>
              <a href="/account/login" class="btn btn--cta">Log In</a>
              <a href="/pricing" class="btn btn--primary">Sign Up</a>
          </div>
      </template>
    </ma-modal>

    <ma-modal :active.sync="modals.upgradeBeforeContact" container-class="modal-width-medium">
      <template v-slot:body>
          <div class="center">
              <p>To contact {{ seller.name }}, you need to be on a paid plan.</p>
              <a href="/pricing" class="btn btn--cta">Upgrade</a>
              <a class="btn btn--secondary" @click.prevent="modals.upgradeBeforeContact = false">Cancel</a>
          </div>
      </template>
    </ma-modal>

    <ma-modal :active.sync="modals.noDownloadsInfo" container-class="modal-width-medium">
      <template v-slot:body>
          <div class="center">
              <p>You have to buy a product from {{ seller.name }} before you can add a review.</p>
              <a class="btn btn--secondary" @click.prevent="modals.noDownloadsInfo = false">Close</a>
          </div>
      </template>
    </ma-modal>

    <ma-modal :active.sync="modals.messageSentConfirmation " container-class="modal-width-medium">
      <template v-slot:body>
          <div class="center">
              <p style="color: forestgreen">Your message was sent to {{ seller.name }}</p>
              <a class="btn btn--secondary" @click.prevent="modals.messageSentConfirmation = false">Close</a>
          </div>
      </template>
    </ma-modal>

    <ma-modal :active.sync="modals.contact" class="contact-modal" container-class="modal-width-large">
      <template v-slot:header>
        Contact {{ seller.name }}
      </template>
      <template v-slot:body>
          <div class="modal-body">
              <div class="contact-form">
                  <div style="display: flex; flex-direction: row">
                      <div class="form__item" style="flex-grow: 1">
                          <label for="contact-name">Name</label>
                          <input id="contact-name" name="name" v-model="contactForm.name" type="text">
                          <div
                            class="validation-error-text"
                            v-for="(error, index) in contactForm.validationErrors.name"
                            :key="index"
                          >
                            {{ error }}
                          </div>
                      </div>
                      <div class="form__item" style="flex-grow: 1; margin-left: 20px">
                          <label for="contact-email">Email</label>
                          <input id="contact-email" name="email" v-model="contactForm.email" type="email">
                          <div
                            class="validation-error-text"
                            v-for="(error, index) in contactForm.validationErrors.email"
                            :key="index"
                          >
                            {{ error }}
                        </div>
                      </div>
                  </div>
                  <div class="form__item">
                      <label for="contact-subject">Subject</label>
                      <input id="contact-subject" name="subject" v-model="contactForm.subject" type="text">
                      <div
                        class="validation-error-text"
                        v-for="(error, index) in contactForm.validationErrors.subject"
                        :key="index"
                      >
                            {{ error }}
                        </div>
                  </div>
                  <div class="form__item">
                      <label for="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        v-model="contactForm.message"
                        rows="3"
                        cols="40"
                      />
                      <div
                        class="validation-error-text"
                        v-for="(error, index) in contactForm.validationErrors.message"
                        :key="index"
                      >
                            {{ error }}
                        </div>
                  </div>
                  <div>
                      <button class="btn btn--cta" :disabled="contactForm.sending" @click.prevent="sendContactMessage">
                          Send Email
                      </button>
                  </div>
              </div>
          </div>
      </template>
    </ma-modal>

    <div v-if="show.modal">
      <div class="modal-cover" @click.prevent="closeModal">
      </div>
      <div class="seller-modal" :style="{ 'max-width': sellerModalMaxWidth }">
        <div class="close-button" @click.prevent="closeModal">
          <div class="icon"></div>
          CLOSE
        </div>
        <div class="seller-modal__container" v-if="show.sellerModal.profileImageCropper">
          <div class="profile-image-cropper-heading">Position and size your photo</div>
          <cropper-canvas-container v-model="newProfilePhoto"></cropper-canvas-container>
          <div class="slider">
            <div class="slider-left">
              <div class="zoom-in-min-icon"></div>
            </div>
            <div class="slider-middle">
              <div class="slider-bar"></div>
              <div class="slider-knob"></div>
            </div>
            <div class="slider-right">
              <div class="zoom-in-max-icon"></div>
            </div>
          </div>
          <div class="cropper-buttons">
            <a class="btn btn--cat-2" style="margin-left: 20px; background-color: #67c7d8;"
               @click.prevent="saveProfilePhoto">Save Changes</a>
            <a class="btn btn--hollow-dark"
               style="border: 2px solid #999999; background-color: #999999"
               @click.prevent="closeModal">Cancel</a>
          </div>
        </div>
        <div v-if="show.sellerModal.reviewList">
          <div class="review-modal-header">
            <div class="header-left">All reviews for {{ seller.name }}</div>
            <div class="header-right">
              <div v-if="!is_my_profile && is_authenticated" class="write-review-button"
                   @click.prevent="showSubmitReview">
                <img class="feedback-icon" src="/assets/images/site/feedback.svg">
                <template v-if="myReview.productId === null">Write your review</template>
                <template v-else>Edit your review</template>
              </div>
            </div>
          </div>

          <review-stats-summary :seller="seller"></review-stats-summary>

          <div style="width: 230px; font-size: 0.9em; margin-bottom: 25px;">
            <review-percentages-breakdown :seller="seller"></review-percentages-breakdown>
          </div>

          <div class="review-sort-controls">
            <hr style="margin-bottom: 20px"/>
            <div style="display: flex; flex-direction: row">
              <span class="sort-select-label">sort by</span>
              <select-two :options="sortSelect.options"
                          v-model="sortSelectValue"
                          style="width: 100%"
              ></select-two>
            </div>
            <hr style="margin-top: 20px"/>
          </div>
          <div class="review-list">
            <div v-for="(review, index) in reviews" class="review-container" :key="index">
              <div class="reviewer-name">
                {{ review.reviewerName }}
                <div class="review-stars">
                  <vue-star-rating
                    :increment="1"
                    :max-rating="5"
                    :rating="review.stars"
                    inactive-color="#FFF"
                    active-color="#f5a623"
                    border-color="#f5a623"
                    show-rating="false"
                    rounded-corners="true"
                    inline="true"
                    border-width="3"
                    read-only="true"
                    star-size="16"
                  />
                </div>
              </div>
              <div class="review-date">
                {{ review.date }}
              </div>
              <div class="review-text">
                {{ review.review }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="show.sellerModal.submitReview">
          <div class="review-modal-header">
            <div class="header-left">Write a Review for {{ seller.name }}</div>
            <div class="header-right">
              <div v-if="reviewCount > 0" class="back-button" @click.prevent="showReviewList">
                <div style="display: flex;">
                  <div style="display: inline">
                    <div class="back-arrow-icon"></div>
                  </div>
                  BACK
                </div>
              </div>
            </div>
          </div>
          <div class="review-submission-info">
            <div class="choose-product">
              Choose product
              <select-two
                      :options="reviewProductSelect.options"
                      v-model="reviewProductSelect.selected"
                      style="width: 250px"
              ></select-two>
              <div
                class="validation-error-text"
                v-for="(error, index) in reviewForm.validationErrors.product_id"
                :key="index"
              >
                {{ error }}
              </div>
            </div>
            <div class="star-rating">
              Star Rating
              <vue-star-rating
                      v-bind:increment="1"
                      v-bind:max-rating="5"
                      v-model="myReview.stars"
                      inactive-color="#FFF"
                      active-color="#f5a623"
                      border-color="#f5a623"
                      show-rating="false"
                      rounded-corners="true"
                      inline="true"
                      border-width="3"
                      star-size="20"
                      class="submit-stars">
              </vue-star-rating>
              <div
                class="validation-error-text"
                v-for="(error, index) in reviewForm.validationErrors.stars"
                :key="index"
              >
                {{ error }}
            </div>
            </div>
          </div>
          <hr style="margin-top: 35px; margin-bottom: 35px;"/>
          <div class="review-feedback-text">
            <template v-if="myReview.productId === null">Write your review</template>
            <template v-else>Edit your review</template>
            <textarea class="review-text-area" v-model="myReview.review"></textarea>
            <div
                class="validation-error-text"
                v-for="(error, index) in reviewForm.validationErrors.review"
                :key="index"
            >
                {{ error }}
            </div>
          </div>
          <div class="submit-button-container">
            <button class="submit-review-button" @click.prevent="updateMyReview">
              <template v-if="myReview.productId === null">SUBMIT REVIEW</template>
              <template v-else>UPDATE REVIEW</template>
            </button>
            <div v-show="reviewForm.reviewFlashMessage.isVisible"
                 class="submitted-message"
                 :style="{color: reviewForm.reviewFlashMessage.color}">
              {{ reviewForm.reviewFlashMessage.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--
    / Modals
    -->
  </div>
</template>

<script>
import CropperCanvasContainer from './CropperCanvasContainer'
import ReviewPercentagesBreakdown from './ReviewPercentagesBreakdown'
import ReviewStatsSummary from './ReviewStatsSummary'
import Modal from '../modal/Modal'
import SellerAPI from '../../services/seller-api'

export default {
    name: 'ProfileHeader',

    components: {
        CropperCanvasContainer,
        ReviewPercentagesBreakdown,
        ReviewStatsSummary,
        MaModal: Modal
    },

    props: {
        seller: {
            required: true
        },
        authUser: {
            required: false,
            default: () => null
        }
    },

    data() {
        return {
            averageRating: 0,
            reviewCount: 0,
            reviews: [],
            sortSelect: {
                options: [
                    { name: 'DATE: LATEST FIRST', id: 'created_at desc' },
                    { name: 'DATE: EARLIEST FIRST', id: 'created_at asc' },
                    { name: 'RATING: HIGHEST FIRST', id: 'stars desc' },
                    { name: 'RATING: LOWEST FIRST', id: 'stars asc' }
                ]
            },
            sortSelectValue: 'created_at desc',
            reviewProductSelect: {
                options: [
                    { name: '- - SELECT - -', id: '' }
                ],
                selected: ''
            },
            show: {
                modal: false,
                sellerModal: {
                    reviewList: true,
                    submitReview: false
                }
            },
            modals: {
                loginPrompt: false,
                upgradeBeforeContact: false,
                noDownloadsInfo: false,
                messageSentConfirmation: false,
                contact: false
            },
            myReview: {
                productId: null,
                stars: null,
                review: null
            },
            reviewForm: {
                validationErrors: {
                    product_id: [],
                    stars: [],
                    review: []
                },
                reviewFlashMessage: {
                    isVisible: false,
                    text: 'Review Saved',
                    color: 'green'
                }
            },
            isEditingProfile: false,
            isProfileDisabled: false,
            sellerInputs: {
                name: this.seller.name,
                profileInfo: this.seller.profile_info
            },
            amIFollowing: false,
            followerCount: null,
            isReviewsTooltipVisible: false,
            sellerModalMaxWidth: '660px',
            oldProfilePhoto: this.seller.profile_image,
            oldHeaderPhoto: this.seller.header_image,
            newProfilePhoto: null,
            newHeaderPhoto: null,
            contactForm: {
                name: this.authUser ? this.authUser.firstname : '',
                email: this.authUser ? this.authUser.email : '',
                subject: '',
                message: '',
                sending: false,
                validationErrors: {
                    name: [],
                    email: [],
                    subject: [],
                    message: [],
                },
            },
            myDownloads: [],
            isStarOpacityApplied: false
        }
    },

    created() {
        this.loadReviewTotals()
        this.getFollowerCount()

        if (this.is_authenticated) {
            this.loadMyDownloads()
            this.checkAmIFollowing()
            this.loadMyReview()
        }
    },

    updated() {
        this.applyStarOpacity()
    },

    computed: {
        is_authenticated() {
            return this.authUser !== null
        },

        is_plan_free() {
            if (!this.is_authenticated) {
                return true
            }

            return this.authUser.plan_id === 5
        },

        is_my_profile() {
            if (!this.is_authenticated) {
                return false
            }

            return this.seller.id === this.authUser.id
        },

        roundedAverageRating() {
            return Math.round(this.averageRating * 10) / 10
        }
    },

    watch: {
        sortSelectValue(val) {
            this.loadReviewList()
        }
    },

    methods: {
        closeModal() {
            this.show.modal = false
        },
        showReviewList() {
            this.sellerModalMaxWidth = '560px'
            this.show = {
                modal: true,
                sellerModal: {
                    reviewList: true,
                    submitReview: false,
                    profileImageCropper: false,
                }
            }
            this.loadReviewList()
            this.loadReviewTotals()
        },
        showSubmitReview() {
            if (this.myDownloads.length > 0) {
                this.sellerModalMaxWidth = '660px'
                this.resetReviewFormValidationErrors()
                this.show = {
                    modal: true,
                    sellerModal: {
                        reviewList: false,
                        submitReview: true,
                        profileImageCropper: false,
                    }
                }
                this.loadMyReview()
            } else {
                this.show.modal = false
                this.modals.noDownloadsInfo = true
            }
        },
        showProfileImageCropper() {
            this.sellerModalMaxWidth = ''
            this.show = {
                modal: true,
                sellerModal: {
                    reviewList: false,
                    submitReview: false,
                    profileImageCropper: true,
                }
            }
        },
        loadReviewList() {
            var orderVars = this.sortSelectValue.split(' ')
            var orderBy = orderVars[0] || 'stars'
            var orderDirection = orderVars[1] || 'desc'

            SellerAPI.getReviews(this.seller.id, {
                order_by: orderBy,
                order_direction: orderDirection
            }).then(data => {
                this.reviews = data
            })
        },
        loadReviewTotals() {
            SellerAPI.getReviewTotals(this.seller.id)
                .then(data => {
                    this.averageRating = data.average
                    this.reviewCount = data.count
                })
        },
        loadMyDownloads() {
            SellerAPI.getPaidDownloads(this.seller.id)
                .then(data => {
                    this.reviewProductSelect.options = [
                        { name: '- - SELECT - -', id: null }
                    ]

                    this.myDownloads = data

                    data.forEach(download => {
                        this.reviewProductSelect.options.push({
                            'id': download.id,
                            'name': download.name
                        })
                    })
                })
        },
        loadMyReview() {
            SellerAPI.getMyReview(this.seller.id)
                .then(data => {
                    if (data === undefined) {
                        this.myReview.productId = null
                        this.myReview.stars = null
                        this.myReview.review = null
                    } else {
                        this.reviewProductSelect.selected = data.productId
                        this.myReview.productId = data.productId
                        this.myReview.stars = data.stars
                        this.myReview.review = data.review
                    }
                })
        },
        updateMyReview() {
            this.myReview.productId = this.reviewProductSelect.selected
            var data = {
                'product_id': this.myReview.productId,
                'stars': this.myReview.stars,
                'review': this.myReview.review,
            }
            SellerAPI.updateMyReview(this.seller.id, data)
                .then(data => {
                    this.resetReviewFormValidationErrors()
                    this.loadReviewTotals()
                    this.flashReviewSaveMessage()
                }, ({ response }) => {
                // If there are validation errors.
                    if (response.status === 422) {
                        const errors = response.data.errors
                        this.reviewForm.validationErrors.product_id = errors.product_id || null
                        this.reviewForm.validationErrors.stars = errors.stars || null
                        this.reviewForm.validationErrors.review = errors.review || null
                    }
                    console.error('Failed to store review. ' + response)
                })
        },
        flashReviewSaveMessage() {
            var _this = this
            this.reviewForm.reviewFlashMessage.isVisible = true
            setTimeout(function () {
                _this.reviewForm.reviewFlashMessage.isVisible = false
            }, 1000)
        },
        updateSellerProfile() {
        // Update profile info
            var data = {
                'seller_display_name': this.sellerInputs.name,
                'profile_info': this.sellerInputs.profileInfo
            }
            SellerAPI.updateProfile(this.seller.id, data)
                .then(data => {
                    this.seller.name = this.sellerInputs.name
                    this.seller.profile_info = this.sellerInputs.profileInfo
                    this.isEditingProfile = false
                }, ({ response }) => {
                    console.error('Failed to store review. ' + response)
                })

            // Upload profile image
            if (this.seller.profile_image !== this.oldProfilePhoto) {
                data = {
                    base64: this.seller.profile_image
                }
                SellerAPI.updateProfileImage(this.seller.id, data)
                    .then(data => {
                        this.oldProfilePhoto = this.seller.profile_image
                    }, ({ response }) => {
                        console.error('Failed to get follower count. ' + response)
                    })
            }

            // Update header image
            if (this.seller.header_image !== this.oldHeaderPhoto) {
                data = {
                    base64: this.seller.header_image
                }
                SellerAPI.updateHeaderImage(this.seller.id, data)
                    .then(data => {
                        this.oldHeaderPhoto = this.seller.header_image
                    }, ({ response }) => {
                        console.error('Failed to get follower count. ' + response)
                    })
            }
        },
        cancelUpdateSellerProfile() {
            this.sellerInputs.name = this.seller.name
            this.sellerInputs.profile_info = this.seller.profile_info
            this.isEditingProfile = false
            this.seller.profile_image = this.oldProfilePhoto
            this.seller.header_image = this.oldHeaderPhoto
        },
        resetReviewFormValidationErrors() {
            this.reviewForm.validationErrors.product_id = []
            this.reviewForm.validationErrors.stars = []
            this.reviewForm.validationErrors.review = []
        },
        resetContactFormValidationErrors() {
            this.contactForm.validationErrors.name = []
            this.contactForm.validationErrors.email = []
            this.contactForm.validationErrors.subject = []
            this.contactForm.validationErrors.message = []
        },
        follow() {
            if (this.is_authenticated) {
                SellerAPI.follow(this.seller.id)
                    .then(data => {
                        this.followerCount++
                        this.amIFollowing = true
                    }, ({ response }) => {
                        console.error('Failed to follow seller. ' + response)
                    })
            } else {
                this.modals.loginPrompt = true
            }
        },
        openContactModal() {
            if (!this.authUser.is_admin && this.is_plan_free) {
                this.modals.upgradeBeforeContact = true
            } else {
                this.contactForm.sent = false
                this.modals.contact = true
            }
        },
        sendContactMessage() {
            var data = {
                name: this.contactForm.name,
                email: this.contactForm.email,
                subject: this.contactForm.subject,
                message: this.contactForm.message,
            }
            this.contactForm.sending = true
            SellerAPI.sendMessage(this.seller.id, data)
                .then(data => {
                    this.contactForm.sending = false
                    this.resetContactFormValidationErrors()
                    this.modals.contact = false
                    this.modals.messageSentConfirmation = true
                }, ({ response }) => {
                    // If there are validation errors.
                    if (response.status === 422) {
                        const errors = response.data.errors
                        this.contactForm.validationErrors.name = errors.name || null
                        this.contactForm.validationErrors.email = errors.email || null
                        this.contactForm.validationErrors.subject = errors.subject || null
                        this.contactForm.validationErrors.message = errors.message || null
                    }
                    this.contactForm.sending = false
                })
        },
        unfollow() {
            SellerAPI.unfollow(this.seller.id)
                .then(data => {
                    this.followerCount--
                    this.amIFollowing = false
                })
        },
        checkAmIFollowing() {
            SellerAPI.amIFollowing(this.seller.id)
                .then(data => {
                    this.amIFollowing = data.amIFollowing
                })
        },
        getFollowerCount() {
            SellerAPI.getFollowerCount(this.seller.id)
                .then(data => {
                    this.followerCount = data.count
                })
        },
        mouseOverReviewsAverageText() {
            this.isReviewsTooltipVisible = true
        },
        mouseOutReviewsAverageText() {
            this.isReviewsTooltipVisible = false
        },
        profilePhotoFileChange(e) {
            var _this = this
            var files = e.target.files || e.dataTransfer.files
            var file = files[0]
            var image = new Image()
            var reader = new FileReader()
            reader.onload = function (e) {
                image = e.target.result
                _this.newProfilePhoto = image
                _this.showProfileImageCropper()
                _this.$refs.profilePhotoFileInput.value = null
            }
            reader.readAsDataURL(file)
        },
        saveProfilePhoto() {
            this.seller.profile_image = this.newProfilePhoto
            this.closeModal()
        },
        headerPhotoFileChange(e) {
            var _this = this
            var files = e.target.files || e.dataTransfer.files
            var file = files[0]
            var image = new Image()
            var reader = new FileReader()
            this.isProfileDisabled = true
            image.onload = function (ev) {
                image = _this.compressImage(image, 100, 3840)
                _this.newHeaderPhoto = image.src
                _this.seller.header_image = _this.newHeaderPhoto
                _this.$refs.headerPhotoFileInput.value = null
                _this.isProfileDisabled = false
            }

            reader.onload = function (ev) {
                image.src = ev.target.result
            }

            reader.readAsDataURL(file)
        },
        applyStarOpacity() {
        // This is a nasty workaround we need to make the star backgrounds transparent
        // instead of black in Safari.
            if (!this.isStarOpacityApplied) {
                var starFills = document.getElementsByTagName('stop')
                for (var i = 0; i < starFills.length; i++) {
                    var stopColor = starFills[i].attributes.getNamedItem('stop-color').value
                    if (stopColor === '#00000000') {
                        starFills[i].attributes.getNamedItem('stop-color').value = 'red'
                        starFills[i].setAttribute('stop-opacity', '0')
                    } else {
                    }
                }
                if (starFills.length > 0) {
                    this.isStarOpacityApplied = true
                }
            }
        },
        compressImage(sourceImgObj, quality, maxWidth, outputFormat) {
            let mimeType = 'image/jpeg'

            if (typeof outputFormat !== 'undefined' && outputFormat === 'png') {
                mimeType = 'image/png'
            }

            maxWidth = maxWidth || 1000
            quality = quality || 100

            let natW = sourceImgObj.naturalWidth
            let natH = sourceImgObj.naturalHeight
            const ratio = natH / natW

            if (natW > maxWidth) {
                natW = maxWidth
                natH = ratio * maxWidth
            }

            const cvs = document.createElement('canvas')

            cvs.width = natW
            cvs.height = natH

            cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, natW, natH)

            const newImageData = cvs.toDataURL(mimeType, quality / 100)

            const resultImageObj = new Image()
            resultImageObj.src = newImageData

            return resultImageObj
        }
    }
}
</script>
