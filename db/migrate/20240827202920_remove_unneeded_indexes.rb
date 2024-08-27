# frozen_string_literal: true

class RemoveUnneededIndexes < ActiveRecord::Migration[7.1]
  def change
    remove_index :account_aliases, name: "index_account_aliases_on_account_id", column: :account_id
    remove_index :account_relationship_severance_events, name: "index_account_relationship_severance_events_on_account_id", column: :account_id
    remove_index :custom_filter_statuses, name: "index_custom_filter_statuses_on_status_id", column: :status_id
    remove_index :webauthn_credentials, name: "index_webauthn_credentials_on_user_id", column: :user_id
  end
end
